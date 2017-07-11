import uploadRoutes from '../routes.js';
import instrumentRoutes from '../../utils/instrumentRoutes';
import entities from 'api/entities';
import documents from 'api/documents';
import references from 'api/references';
import {catchErrors} from 'api/utils/jasmineHelpers';
import search from 'api/search/search';

import db from 'api/utils/testing_db';
import fixtures, {entityId} from './fixtures.js';

describe('upload routes', () => {
  let routes;
  let req;
  let file;
  let iosocket;

  beforeEach((done) => {
    spyOn(search, 'index').and.returnValue(Promise.resolve());
    iosocket = jasmine.createSpyObj('socket', ['emit']);
    let io = {getCurrentSessionSockets: () => {
      return {sockets: [iosocket], emit: iosocket.emit};
    }};
    routes = instrumentRoutes(uploadRoutes);
    file = {fieldname: 'file',
            originalname: 'gadgets-01.pdf',
            encoding: '7bit',
            mimetype: 'application/octet-stream',
            destination: __dirname + '/uploads/',
            filename: 'f2082bf51b6ef839690485d7153e847a.pdf',
            path: __dirname + '/uploads/f2082bf51b6ef839690485d7153e847a.pdf',
            size: 171411271};
    req = {language: 'es', user: 'admin', headers: {}, body: {document: 'id'}, files: [file], io};

    db.clearAllAndLoad(fixtures, (err) => {
      if (err) {
        done.fail(err);
      }
      done();
    });
  });

  describe('POST/upload', () => {
    //temporary test for the conversion, probably this will go on another
    it('should process the document after upload', (done) => {
      routes.post('/api/upload', req)
      .then(() => {
        setTimeout(() => {
          return Promise.all([
            documents.get({sharedId: 'id', language: 'es'}, '+fullText'),
            documents.get({sharedId: 'id', language: 'en'}, '+fullText')
          ])
          .then(([docES, docEN]) => {
            expect(iosocket.emit).toHaveBeenCalledWith('conversionStart', 'id');
            expect(iosocket.emit).toHaveBeenCalledWith('documentProcessed', 'id');
            expect(docEN[0].processed).toBe(true);
            expect(docEN[0].fullText).toMatch(/Test\[\[1\]\] file/);
            expect(docEN[0].language).toBe('en');

            expect(docES[0].processed).toBe(true);
            expect(docES[0].fullText).toMatch(/Test\[\[1\]\] file/);
            expect(docES[0].language).toBe('es');
            done();
          })
          .catch(catchErrors(done));
        }, 1000);
      })
      .catch(catchErrors(done));
    });

    fdescribe('when conversion fails', () => {
      it('should set document processed to false and emit a socket conversionFailed event with the id of the document', (done) => {
        iosocket.emit.and.callFake((eventName) => {
          if (eventName === 'conversionFailed') {
            setTimeout(() => {
              entities.getAllLanguages('id')
              .then(docs => {
                expect(docs[0].processed).toBe(false);
                expect(docs[1].processed).toBe(false);
                done();
              });
            }, 500);
          }
        });

        req.files = ['invalid_file'];
        routes.post('/api/upload', req)
        .catch(done.fail);
      });
    });

    describe('when upload finishes', () => {
      it('should update the document with the file path and uploaded flag to true', (done) => {
        routes.post('/api/upload', req)
        .then((response) => {
          expect(response).toEqual(file);
          return documents.getById('id', 'es');
        })
        .then((doc) => {
          expect(doc.file.originalname).toEqual(file.originalname);
          expect(doc.file.filename).toEqual(file.filename);
          expect(doc.uploaded).toEqual(true);
          done();
        })
        .catch(done.fail);
      });
    });
  });

  describe('POST/reupload', () => {
    beforeEach(() => {
      spyOn(references, 'deleteTextReferences').and.returnValue(Promise.resolve());
    });

    it('should reupload a document', (done) => {
      req.body.document = entityId;
      routes.post('/api/reupload', req)
      .then(response => {
        expect(references.deleteTextReferences).toHaveBeenCalledWith('id', 'es');
        expect(response).toEqual(file);

        return documents.getById('id', 'es');
      })
      .then(modifiedDoc => {
        expect(modifiedDoc.toc.length).toBe(0);
        done();
      })
      .catch(done.fail);
    });
  });
});

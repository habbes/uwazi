import templateRoutes from 'api/templates/routes.js';
import database from 'api/utils/database.js';
import fixtures from './fixtures.js';
import instrumentRoutes from 'api/utils/instrumentRoutes';
import templates from 'api/templates/templates';
import templatesModel from 'api/templates/templatesModel';
import {catchErrors} from 'api/utils/jasmineHelpers';
import neo4jdb from 'api/utils/neo4jdb.js';

fdescribe('templates routes', () => {
  let routes;

  beforeEach((done) => {
    routes = instrumentRoutes(templateRoutes);
    neo4jdb.resetTestingDatabase()
    .then(() => neo4jdb.import(fixtures))
    .then(done)
    .catch(catchErrors(done));
  });

  describe('GET', () => {
    it('should return all templates by default', (done) => {
      routes.get('/api/templates')
      .then((response) => {
        let docs = response.rows;
        expect(docs[0].name).toBe('Mechanism');
        expect(docs[1].name).toBe('Judge');
        done();
      })
      .catch(catchErrors(done));
    });

    describe('when passing id', () => {
      it('should return matching template', (done) => {
        let req = {query: {_id: 'abc2'}};

        routes.get('/api/templates', req)
        .then((response) => {
          let docs = response.rows;
          expect(docs[0].name).toBe('Mechanism');
          done();
        })
        .catch(catchErrors(done));
      });
    });

    describe('when there is a db error', () => {
      it('return the error in the response', (done) => {
        let req = {query: {_id: 'non_existent_id'}};

        database.reset_testing_database()
        .then(() => routes.get('/api/templates', req))
        .then((response) => {
          expect(response.status).toBe(500);
          expect(response.error).toBe('not_found');
          done();
        })
        .catch(catchErrors(done));
      });
    });
  });

  describe('DELETE', () => {
    it('should delete a template', (done) => {
      spyOn(templatesModel, 'delete').and.returnValue(Promise.resolve('ok'));
      routes.delete('/api/templates', {query: 'template'})
      .then((response) => {
        expect(templatesModel.delete).toHaveBeenCalledWith('template');
        expect(response).toBe('ok');
        done();
      })
      .catch(catchErrors(done));
    });

    describe('when there is a db error', () => {
      it('should return the error in the response', (done) => {
        spyOn(templatesModel, 'delete').and.returnValue(Promise.reject({error: 'All your base belongs to us'}));
        routes.delete('/api/templates', {query: 'template'})
        .then((response) => {
          expect(response.status).toBe(500);
          expect(response.error).toBe('All your base belongs to us');
          done();
        })
        .catch(catchErrors(done));
      });
    });
  });

  describe('POST', () => {
    it('should create a template', (done) => {
      spyOn(templatesModel, 'save').and.returnValue(new Promise((resolve) => resolve({response: 'response'})));
      let req = {body: {name: 'created_template', properties: [{label: 'fieldLabel'}]}};

      routes.post('/api/templates', req)
      .then((response) => {
        expect(response.response).toBe('response');
        expect(templatesModel.save).toHaveBeenCalledWith(req.body);
        done();
      })
      .catch(catchErrors(done));
    });

    describe('when there is a db error', () => {
      it('should return the error in the response', (done) => {
        spyOn(templatesModel, 'save').and.returnValue(new Promise((resolve, reject) => reject({error: 'not_found'})));
        let req = {body: {}};
        routes.post('/api/templates', req)
        .then((response) => {
          expect(response.status).toBe(500);
          expect(response.error).toBe('not_found');
          done();
        })
        .catch(catchErrors(done));
      });
    });
  });

  describe('/templates/count_by_thesauri', () => {
    it('should return the number of templates using a thesauri', (done) => {
      spyOn(templates, 'countByThesauri').and.returnValue(Promise.resolve(2));
      let req = {query: {_id: 'abc1'}};
      routes.get('/api/templates/count_by_thesauri', req)
      .then((result) => {
        expect(result).toBe(2);
        expect(templates.countByThesauri).toHaveBeenCalledWith('abc1');
        done();
      })
      .catch(catchErrors(done));
    });
  });
});

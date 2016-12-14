import thesaurisRoute from '../routes.js';
import database from '../../utils/database.js';
import fixtures from './fixtures.js';
import {db_url as dbUrl} from '../../config/database.js';
import request from '../../../shared/JSONRequest';
import instrumentRoutes from '../../utils/instrumentRoutes';
import thesaurisModel from '../thesaurisModel';
import neo4jdb from 'api/utils/neo4jdb.js';

describe('thesauris routes', () => {
  let routes;

  beforeEach((done) => {
    routes = instrumentRoutes(thesaurisRoute);
    neo4jdb.resetTestingDatabase()
    .then(() => neo4jdb.import(fixtures))
    .then(done);
  });

  fdescribe('GET', () => {
    it('should return all thesauris by default', (done) => {
      spyOn(thesaurisModel, 'get').and.callThrough();
      spyOn(thesaurisModel, 'getEntities').and.callThrough();
      routes.get('/api/thesauris', {language: 'es'})
      .then((response) => {
        let thesauris = response.rows;
        expect(thesaurisModel.get).toHaveBeenCalled();
        expect(thesaurisModel.getEntities).toHaveBeenCalledWith('es');

        const countries = thesauris.find(t => t.name === 'Countries');
        expect(countries.values[0].label).toBe('Ecuador');
        done();
      })
      .catch(done.fail);
    });

    describe('when passing id', () => {
      it('should return matching thesauri', (done) => {
        let req = {query: {_id: 'countries'}};

        routes.get('/api/thesauris', req)
        .then((response) => {
          let doc = response.rows[0];
          expect(doc.name).toBe('Countries');
          done();
        })
        .catch(done.fail);
      });
    });

    describe('when there is a db error', () => {
      beforeEach(() => {
        spyOn(thesaurisModel, 'get').and.returnValue(Promise.reject({error: 'error'}));
      });

      it('return the error in the response', (done) => {
        let req = {language: 'es'};

        routes.get('/api/thesauris', req)
        .then(response => {
          expect(response.error).toBe('error');
          expect(response.status).toBe(500);
          done();
        })
        .catch(done.fail);
      });
    });
  });

  fdescribe('DELETE', () => {
    it('should delete a thesauri', (done) => {
      spyOn(thesaurisModel, 'delete').and.returnValue(Promise.resolve('ok'));
      let req = {query: {_id: 'abc'}};
      return routes.delete('/api/thesauris', req)
      .then(response => {
        expect(response).toBe('ok');
        expect(thesaurisModel.delete).toHaveBeenCalledWith('abc');
        done();
      })
      .catch(done.fail);
    });

    describe('When error', () => {
      it('should respond and error with status 500', (done) => {
        spyOn(thesaurisModel, 'delete').and.returnValue(Promise.reject({error: 'error'}));
        let req = {query: {_id: 'abc'}};
        return routes.delete('/api/thesauris', req)
        .then(response => {
          expect(response.error).toBe('error');
          expect(response.status).toBe(500);
          done();
        })
        .catch(done.fail);
      });
    });
  });

  fdescribe('POST', () => {
    it('should create a thesauri', (done) => {
      const req = {body: {name: 'Batman wish list', values: [{id: '1', label: 'Joker BFF'}]}};

      spyOn(thesaurisModel, 'save').and.returnValue(Promise.resolve({response: 'response'}));

      routes.post('/api/thesauris', req)
      .then((response) => {
        expect(response.response).toBe('response');
        expect(thesaurisModel.save).toHaveBeenCalledWith(req.body);
        done();
      })
      .catch(done.fail);
    });

    describe('when there is a db error', () => {
      it('return the error in the response', (done) => {
        let req = {body: {_id: 'c08ef2532f0bd008ac5174b45e033c93', _rev: 'bad_rev', name: ''}};

        spyOn(thesaurisModel, 'save').and.returnValue(Promise.reject({error: 'error'}));

        routes.post('/api/thesauris', req)
        .then(response => {
          expect(response.error).toBe('error');
          expect(response.status).toBe(500);
          done();
        })
        .catch(done.fail);
      });
    });
  });
});

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
      it('return the error in the response', (done) => {
        let req = {query: {_id: 'non_existent_id'}, language: 'es'};

        database.reset_testing_database()
        .then(() => routes.get('/api/thesauris', req))
        .then((response) => {
          let error = response.error;
          expect(error.error).toBe('not_found');
          done();
        })
        .catch(done.fail);
      });
    });
  });

  describe('DELETE', () => {
    it('should delete a thesauri', (done) => {
      spyOn(thesaurisModel, 'delete').and.returnValue(Promise.resolve());
      let req = {query: {_id: 'abc', _rev: '123'}};
      return routes.delete('/api/thesauris', req)
      .then(() => {
        expect(thesaurisModel.delete).toHaveBeenCalledWith('abc', '123');
        done();
      })
      .catch(done.fail);
    });
  });

  describe('POST', () => {
    it('should create a thesauri', (done) => {
      let req = {body: {name: 'Batman wish list', values: [{id: '1', label: 'Joker BFF'}]}};
      let postResponse;

      routes.post('/api/thesauris', req)
      .then((response) => {
        postResponse = response;
        return request.get(dbUrl + '/_design/thesauris/_view/all');
      })
      .then((response) => {
        let newDoc = response.json.rows.find((thesauri) => {
          return thesauri.value.name === 'Batman wish list';
        });

        expect(newDoc.value.values).toEqual([{id: '1', label: 'Joker BFF'}]);
        expect(newDoc.value._rev).toBe(postResponse.rev);
        done();
      })
      .catch(done.fail);
    });

    it('should set a default value of [] to values property if its missing', (done) => {
      let req = {body: {name: 'Scarecrow nightmares'}};
      let postResponse;

      routes.post('/api/thesauris', req)
      .then((response) => {
        postResponse = response;
        return request.get(dbUrl + '/_design/thesauris/_view/all');
      })
      .then((response) => {
        let newDoc = response.json.rows.find((template) => {
          return template.value.name === 'Scarecrow nightmares';
        });

        expect(newDoc.value.name).toBe('Scarecrow nightmares');
        expect(newDoc.value.values).toEqual([]);
        expect(newDoc.value._rev).toBe(postResponse.rev);
        done();
      })
      .catch(done.fail);
    });

    describe('when passing _id and _rev', () => {
      it('edit an existing one', (done) => {
        request.get(dbUrl + '/c08ef2532f0bd008ac5174b45e033c94')
        .then((response) => {
          let template = response.json;
          let req = {body: {_id: template._id, _rev: template._rev, name: 'changed name'}};
          return routes.post('/api/thesauris', req);
        })
        .then(() => {
          return request.get(dbUrl + '/c08ef2532f0bd008ac5174b45e033c94');
        })
        .then((response) => {
          let template = response.json;
          expect(template.name).toBe('changed name');
          done();
        })
        .catch(done.fail);
      });
    });

    describe('when there is a db error', () => {
      it('return the error in the response', (done) => {
        let req = {body: {_id: 'c08ef2532f0bd008ac5174b45e033c93', _rev: 'bad_rev', name: ''}};

        routes.post('/api/thesauris', req)
        .then((response) => {
          let error = response.error;
          expect(error.error).toBe('bad_request');
          done();
        })
        .catch(done.fail);
      });
    });
  });
});

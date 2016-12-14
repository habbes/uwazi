import thesaurisModel from 'api/thesauris/thesaurisModel';
import {catchErrors} from 'api/utils/jasmineHelpers';
import fixtures from './fixtures';
import neo4jdb from 'api/utils/neo4jdb.js';

describe('Thesauris model', () => {

  beforeEach((done) => {
    neo4jdb.resetTestingDatabase()
    .then(() => neo4jdb.import(fixtures))
    .then(done);
  });

  describe('get', () => {
    it('should return Dictionaries and Templates nodes with its properties', (done) => {
      thesaurisModel.get('es')
      .then((response) => {
        const thesauris = response.rows;

        const countries = thesauris.find(t => t.name === 'Countries');
        expect(countries.values).toContain({label: 'Ecuador', id: 'abc3', icon: null});
        expect(countries.values).toContain({label: 'Spain', id: 'abc2', icon: null});

        const mechanism = thesauris.find(t => t.name === 'Mechanism');
        expect(mechanism.values[0]).toEqual({label: 'Corte Nacional', id: 'abc1', icon: 'Something'});
        expect(mechanism.values[1]).toEqual({label: 'spanish', id: 'abc2', icon: null});
        expect(mechanism.values.length).toBe(2);

        const judges = thesauris.find(t => t.name === 'Judges');
        expect(judges.values).toEqual([]);

        const types = thesauris.find(t => t.name === 'Types');
        expect(types.values).toEqual([]);

        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('getById', () => {
    it('should return the matching Dictionary with its values', (done) => {
      thesaurisModel.getById('countries')
      .then((response) => {
        const thesauri = response.rows[0];

        expect(thesauri.name).toBe('Countries');
        expect(thesauri.values).toContain({label: 'Ecuador', id: 'abc3', icon: null});
        expect(thesauri.values).toContain({label: 'Spain', id: 'abc2', icon: null});

        done();
      })
      .catch(catchErrors(done));
    });

    describe('when dictionary has no values', () => {
      it('should return the matching Dictionary with empty values', (done) => {
        thesaurisModel.getById('types')
        .then((response) => {
          const thesauri = response.rows[0];

          expect(thesauri.name).toBe('Types');
          expect(thesauri.values).toEqual([]);

          done();
        })
        .catch(catchErrors(done));
      });
    });
  });

  describe('save', () => {
    it('should create a Template with its properties', (done) => {
      let dictionary = {name: 'SuprHeroes', values: [{label: 'Robin'}, {label: 'Batman'}]};
      thesaurisModel.save(dictionary)
      .then((response) => {
        expect(response.name).toEqual('SuprHeroes');
        expect(response.values[0].label).toBe('Batman');
        expect(response.values[1].label).toBe('Robin');
        done();
      })
      .catch(catchErrors(done));
    });
  });
});

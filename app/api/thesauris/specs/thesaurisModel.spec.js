import thesaurisModel from 'api/thesauris/thesaurisModel';
import {catchErrors} from 'api/utils/jasmineHelpers';
import fixtures from './fixtures';
import neo4jdb from 'api/utils/neo4jdb.js';
import query from 'api/neo4j/query';

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

  fdescribe('save', () => {
    it('should create a Dictionary with its values', (done) => {
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

    it('should edit (MERGE) a Dictionary and values if existing ID is passed', (done) => {
      const dictionary = {
        _id: 'countries',
        name: 'ChangedName',
        values: [{label: 'NewValue'}, {label: 'Spain', id: 'abc2'}, {label: 'Ecuador', id: 'abc3'}]
      };

      thesaurisModel.save(dictionary)
      .then((response) => {
        expect(response._id).toEqual('countries');
        expect(response.name).toEqual('ChangedName');
        expect(response.values[0].label).toBe('Ecuador');
        expect(response.values[1].label).toBe('NewValue');
        expect(response.values[1].id).toBeDefined();
        expect(response.values[2].label).toBe('Spain');

        return thesaurisModel.getById('countries');
      })
      .then(response => {
        const editedThesauri = response.rows[0];
        expect(editedThesauri.name).toBe('ChangedName');
        expect(editedThesauri.values.length).toBe(3);
        done();
      })
      .catch(catchErrors(done));
    });
  });

  fdescribe('delete', () => {
    it('should delete a Dictionary and its related values', (done) => {
      thesaurisModel.delete('countries')
      .then(response => {
        expect(response).toBe('ok');

        return Promise.all([
          query('MATCH (d:Dictionary {_id: "countries"}) return d'),
          query('MATCH (v:DictionaryValue) return v')
        ]);
      })
      .then(([dictionaries, values]) => {
        expect(dictionaries.records.length).toBe(0);
        expect(values.records.length).toBe(1);
        done();
      })
      .catch(catchErrors(done));
    });
  });
});

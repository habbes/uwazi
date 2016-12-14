import thesaurisModel from 'api/thesauris/thesaurisModel';
import query from 'api/neo4j/query';
import {catchErrors} from 'api/utils/jasmineHelpers';

describe('Thesauris model', () => {

  beforeEach((done) => {
    query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r')
    .then(() => {
      return query('CREATE (d:Dictionary {name: "Countries"}), ' +
                   '(p0:DictionaryValue {label: "Spain", id: "abc2"}), ' +
                   '(p1:DictionaryValue {label: "Ecuador", id: "abc3"}), ' +
                   '(d)-[:VALUE]->(p0), ' +
                   '(d)-[:VALUE]->(p1), ' +
                   '(t:Template {name: "Mechanism", isEntity: true}), ' +
                   '(t2:Template {name: "Judges", isEntity: true}), ' +
                   '(e:Entity {title: "National Court", sharedId: "abc1", icon: "Something"}), ' +
                   '(e)-[:TEMPLATE]->(t)');
    })
    .then(() => {
      done();
    })
    .catch(catchErrors(done));
  });

  describe('get', () => {
    it('should return Dictionaries and Templates nodes with its properties', (done) => {
      thesaurisModel.get()
      .then((response) => {
        expect(response.rows[0].name).toEqual('Countries');
        expect(response.rows[0].values[0].label).toBe('Ecuador');
        expect(response.rows[0].values[0].id).toBe('abc3');
        expect(response.rows[0].values[1].label).toBe('Spain');
        expect(response.rows[0].values[1].id).toBe('abc2');

        expect(response.rows[2].name).toBe('Mechanism');
        expect(response.rows[2].values[0].label).toBe('National Court');
        expect(response.rows[2].values[0].id).toBe('abc1');
        expect(response.rows[2].values[0].icon).toBe('Something');

        expect(response.rows[1].name).toBe('Judges');
        expect(response.rows[1].values).toEqual([]);

        done();
      })
      .catch(catchErrors(done));
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

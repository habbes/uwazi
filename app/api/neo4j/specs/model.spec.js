import model from 'api/neo4j/model';
import query from 'api/neo4j/query';
import {catchErrors} from 'api/utils/jasmineHelpers';

fdescribe('neo4j model', () => {
  let testModel = model('SuperHero');

  beforeEach((done) => {
    query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r')
    .then(() => {
      return query('CREATE (h:SuperHero {name:"Batman"}), (r:RealID {name:"Bruce Wayne"}), (h)-[:REAL_ID]->(r)');
    })
    .then(() => {
      done();
    });
  });

  describe('get', () => {
    it('should return all nodes with label SuperHero', (done) => {
      testModel.get()
      .then((response) => {
        expect(response.rows[0].name).toEqual('Batman');
        expect(response.rows[0]._id).toBeDefined();
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('save', () => {
    it('should save the SuperHero and return it', (done) => {
      testModel.save({name: 'Spiderman'})
      .then((response) => {
        expect(response.name).toEqual('Spiderman');
        expect(response._id).toBeDefined();
        done();
      })
      .catch(catchErrors(done));
    });
  });
});

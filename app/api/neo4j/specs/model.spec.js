import model from 'api/neo4j/model';
import query from 'api/neo4j/query';

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
    it('should return all SuperHeroes', (done) => {
      testModel.get()
      .then((response) => {
        expect(response.rows[0].properties).toEqual({name: 'Batman'});
        done();
      })
      .catch((errors) => {
        console.log(errors);
        done();
      });
    });
  });
});

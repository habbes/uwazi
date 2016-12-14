import query from 'api/neo4j/query';

let database = {
  resetTestingDatabase () {
    return query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r');
  },

  import(fixture) {
    return query(`CREATE ${fixture.neo4j.join(', ')}`);
  }
};

export default database;

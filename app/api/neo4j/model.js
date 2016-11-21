import query from './query';

export default (type) => {
  return {
    get: () => {
      return query(`MATCH (n:${type}) return properties(n) as properties, id(n) as id`)
      .then((response) => {
        return {
          rows: response.records.map((record) => record.toObject())
        };
      });
    }
  };
};

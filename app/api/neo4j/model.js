import query from './query';

export default (type) => {
  function processRecord(_record) {
    let record = _record.toObject();
    record.id.toInt();
    return Object.assign({id: record.id.toInt()}, record.properties);
  }

  return {
    get: () => {
      return query(`MATCH (n:${type}) RETURN properties(n) AS properties, id(n) AS id`)
      .then((response) => {
        return {
          rows: response.records.map(processRecord)
        };
      });
    },
    save: (props) => {
      return query(`CREATE (n:${type}) SET n = {props} RETURN properties(n) AS properties, id(n) AS id`, {props})
      .then((response) => {
        return processRecord(response.records[0]);
      });
    }
  };
};

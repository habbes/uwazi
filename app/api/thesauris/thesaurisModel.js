import query from 'api/neo4j/query';
import ID from 'shared/uniqueID';

function processDictionary(_record) {
  let record = _record.toObject();
  return Object.assign({}, record._props, {values: record.values});
}

const templatesModel = {
  get: () => {
    return Promise.all([templatesModel.getDictionaries(), templatesModel.getEntities()])
    .then(([dictionaries, entities]) => {
      return {rows: dictionaries.rows.concat(entities.rows)};
    });
  },

  getDictionaries: () => {
    return query('MATCH (d:Dictionary)-[r:VALUE]->(v:DictionaryValue) ' +
                 'WITH d, {label: v.label, id: v.id, icon: v.icon} as value ' +
                 'ORDER BY v.label ASC ' +
                 'RETURN properties(d) AS _props, collect(value) as values')
    .then((response) => {
      return {
        rows: response.records.map(processDictionary)
      };
    });
  },

  getEntities: () => {
    return query('MATCH (t:Template) WHERE NOT (:Entity)-[:TEMPLATE]->(t:Template) ' +
                 'WITH t, [] as values ' +
                 'RETURN properties(t) as _props, values ' +
                 'UNION ' +
                 'MATCH (e:Entity)-[:TEMPLATE]->(t:Template) ' +
                 'WITH t, {label: e.title, id: e.sharedId, icon: e.icon} as value ' +
                 'RETURN properties(t) as _props, collect(value) as values')
    .then((response) => {
      return {
        rows: response.records.map(processDictionary)
      };
    });
  },

  save: (dictionary) => {
    dictionary._id = dictionary._id || ID();
    const values = dictionary.values.map((value) => {
      value._id = value._id || ID();
      return value;
    });
    delete dictionary.values;
    let queryString = 'MERGE (d:Dictionary {_id: {dictionary}._id}) SET d = {dictionary} ' +
                      'WITH d UNWIND {values} as map ' +
                      'MERGE (v:DictionaryValue {_id: map._id}) SET v = map ' +
                      'MERGE (d)-[:VALUE]->(v) ' +
                      'WITH d, {label: v.label, _id: v._id, icon: v.icon} as value ' +
                      'ORDER BY v.label ASC ' +
                      'RETURN properties(d) AS _props, collect(value) as values';
    return query(queryString, {dictionary, values})
    .then((response) => {
      return processDictionary(response.records[0]);
    })
    .catch(console.log);
  }
};

export default templatesModel;

import query from 'api/neo4j/query';

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
                 'RETURN id(d) AS _id, properties(d) AS _props, collect(value) as values')
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
    const values = dictionary.values;
    delete dictionary.values;
    let queryString = 'CREATE (d:Dictionary {dictionary}) ' +
                      'WITH d UNWIND {values} as map ' +
                      'CREATE (v:DictionaryValue), ' +
                      '(d)-[:VALUE]->(v) SET v = map ' +
                      'WITH d, {label: v.label, _id: id(v), icon: v.icon} as value ' +
                      'ORDER BY v.label ASC ' +
                      'RETURN id(d) AS _id, properties(d) AS _props, collect(value) as values';
    return query(queryString, {dictionary, values})
    .then((response) => {
      return processDictionary(response.records[0]);
    })
    .catch(console.log);
  }
};

export default templatesModel;

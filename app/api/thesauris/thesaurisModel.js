import query from 'api/neo4j/query';
import ID from 'shared/uniqueID';

function processDictionary(_record) {
  let record = _record.toObject();
  return Object.assign({}, record._props, {values: record.values});
}

const thesaurisModel = {
  get: function (language) {
    return Promise.all([this.getDictionaries(), this.getEntities(language)])
    .then(([dictionaries, entities]) => {
      return {rows: dictionaries.rows.concat(entities.rows)};
    });
  },

  getById: function (id) {
    return query(`MATCH (d:Dictionary {_id: "${id}"}) ` +
                 `WITH d OPTIONAL MATCH (d:Dictionary)-[r:VALUE]->(v:DictionaryValue) ` +
                 'WITH d, CASE v WHEN null THEN null ELSE {label: v.label, id: v.id, icon: v.icon} END as value ' +
                 'ORDER BY v.label ASC ' +
                 'RETURN properties(d) AS _props, collect(value) as values')
    .then((response) => {
      return {
        rows: response.records.map(processDictionary)
      };
    });
  },

  getDictionaries: () => {
    return query('MATCH (d:Dictionary) ' +
                 `WITH d OPTIONAL MATCH (d:Dictionary)-[r:VALUE]->(v:DictionaryValue) ` +
                 'WITH d, CASE v WHEN null THEN null ELSE {label: v.label, id: v.id, icon: v.icon} END as value ' +
                 'ORDER BY v.label ASC ' +
                 'RETURN properties(d) AS _props, collect(value) as values')
    .then((response) => {
      return {
        rows: response.records.map(processDictionary)
      };
    });
  },

  getEntities: (language) => {
    const queryString = `MATCH (t:Template) ` +
                        `WITH t OPTIONAL MATCH (e:Entity {language: "${language}"})-[:TEMPLATE]->(t:Template) ` +
                        'WITH t, CASE e.sharedId WHEN null THEN null ELSE {label: e.title, id: e.sharedId, icon: e.icon} END as value ' +
                        'ORDER BY value.label ASC ' +
                        'RETURN properties(t) AS _props, collect(value) as values';

    return query(queryString)
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
    });
  },

  delete: (id) => {
    return query(`MATCH (d:Dictionary {_id: "${id}"}) WITH d OPTIONAL MATCH (d)-[:VALUE]->(v) DETACH DELETE d,v`)
    .then(() => {
      return 'ok';
    });
  }
};

export default thesaurisModel;

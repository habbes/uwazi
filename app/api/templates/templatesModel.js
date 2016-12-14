import query from 'api/neo4j/query';
import ID from 'shared/uniqueID';

function processRecord(_record) {
  let record = _record.toObject();
  let properties = {properties: record.properties.map((prop) => {
    if (prop.nestedProperties) {
      prop.nestedProperties = JSON.parse(prop.nestedProperties);
    }
    return prop;
  })};
  return Object.assign(record._props, properties);
}

const templatesModel = {
  get: () => {
    return query('MATCH (n:Template)' +
                 'WITH n OPTIONAL MATCH (n)-[:PROPERTY]->(p) ' +
                 'WITH n,p ORDER BY p.order ASC ' +
                 'RETURN properties(n) AS _props, collect(properties(p)) as properties')
    .then((response) => {
      return {
        rows: response.records.map(processRecord)
      };
    });
  },

  getById: (id) => {
    const queryString = `MATCH (n:Template) WHERE n._id="${id}"` +
                        'WITH n OPTIONAL MATCH (n)-[:PROPERTY]->(p) ' +
                        'WITH n,p ORDER BY p.order ASC ' +
                        'RETURN properties(n) AS _props, collect(properties(p)) as properties';
    return query(queryString)
    .then((response) => {
      return response.records.length ? {rows: response.records.map(processRecord)} : Promise.reject({error: 'not_found'});
    });
  },

  save: (template) => {
    template._id = template._id || ID();
    const properties = template.properties.map((prop, index) => {
      prop.order = index;
      prop._id = prop._id || ID();
      if (prop.nestedProperties) {
        prop.nestedProperties = JSON.stringify(prop.nestedProperties);
      }
      return prop;
    });
    delete template.properties;
    let queryString = 'MERGE (t:Template {_id: {template}._id}) SET t = {template} ' +
                      'WITH t OPTIONAL MATCH (t)-[:PROPERTY]->(f:TemplateProperty) DETACH DELETE f ' +
                      'WITH t UNWIND {properties} as prop ' +
                      'MERGE (p:TemplateProperty {_id: prop._id}) SET p = prop ' +
                      'MERGE (t)-[:PROPERTY]->(p) ' +
                      'WITH t, p ' +
                      'ORDER BY p.order ASC ' +
                      'RETURN properties(t) AS _props, collect(properties(p)) as properties';
    return query(queryString, {template, properties})
    .then((response) => {
      return processRecord(response.records[0]);
    });
  },

  delete: (id) => {
    return query(`MATCH (t:Template {_id: "${id}"}) WITH t OPTIONAL MATCH (t)-[:PROPERTY]->(p) DETACH DELETE t,p`)
    .then(() => {
      return 'ok';
    });
  }
};

export default templatesModel;

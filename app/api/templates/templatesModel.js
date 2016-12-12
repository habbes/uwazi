import query from 'api/neo4j/query';
import ID from 'shared/uniqueID';

function processRecord(_record) {
  let record = _record.toObject();
  let properties = {properties: record.properties.map((prop) => {
    if (prop.properties.nestedProperties) {
      prop.properties.nestedProperties = JSON.parse(prop.properties.nestedProperties);
    }
    return prop.properties;
  })};
  return Object.assign(record._props, properties, {actualProps: record.actualProps});
}

const templatesModel = {
  get: () => {
    return query('MATCH (n:Template)-[r:PROPERTY]->(p:TemplateProperty) ' +
                 'WITH n, {properties: properties(p)} as prop ' +
                 'ORDER BY p.order ASC ' +
                 'RETURN properties(n) AS _props, collect(prop) as properties')
    .then((response) => {
      return {
        rows: response.records.map(processRecord)
      };
    });
  },

  getById: (id) => {
    return query('MATCH (n:Template)-[r:PROPERTY]->(p:TemplateProperty) ' +
                 `WHERE n._id="${id}" ` +
                 'WITH n, {properties: properties(p)} as prop ' +
                 'ORDER BY p.order ASC ' +
                 'RETURN properties(n) AS _props, collect(prop) as properties')
    .then((response) => {
      return processRecord(response.records[0]);
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
                      'WITH t MATCH (t)-[:PROPERTY]->(p) DETACH DELETE p ' +
                      'WITH t UNWIND {properties} as prop ' +
                      'MERGE (p:TemplateProperty {_id: prop._id}) SET p = prop ' +
                      'MERGE (t)-[:PROPERTY]->(p) ' +
                      'WITH t, {properties: properties(p)} as prop ' +
                      'ORDER BY prop.order ASC ' +
                      'RETURN properties(t) AS _props, collect(prop) as properties';
    return query(queryString, {template, properties})
    .then((response) => {
      return processRecord(response.records[0]);
    });
  }
};

export default templatesModel;

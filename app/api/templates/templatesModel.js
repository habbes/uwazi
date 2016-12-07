import query from 'api/neo4j/query';
import {v1} from 'neo4j-driver';

function processRecord(_record) {
  let record = _record.toObject();
  record.id.toInt();
  let properties = {properties: record.properties.map((prop) => {
    if (prop.properties.nestedProperties) {
      prop.properties.nestedProperties = JSON.parse(prop.properties.nestedProperties);
    }
    return Object.assign({_id: prop.id}, prop.properties);
  })};
  return Object.assign({id: record.id.toInt()}, record._props, properties);
}

const templatesModel = {
  get: () => {
    return query('MATCH (n:Template)-[r:PROPERTY]->(p:TemplateProperty) ' +
                 'WITH n, {properties: properties(p), id: id(p)} as prop ' +
                 'ORDER BY p.order ASC ' +
                 'RETURN id(n) AS id, properties(n) AS _props, collect(prop) as properties')
    .then((response) => {
      return {
        rows: response.records.map(processRecord)
      };
    });
  },

  getById: (id) => {
    return query('MATCH (n:Template)-[r:PROPERTY]->(p:TemplateProperty) ' +
                 `WHERE id(n)=${id} ` +
                 'WITH n, {properties: properties(p), id: id(p)} as prop ' +
                 'ORDER BY p.order ASC ' +
                 'RETURN id(n) AS id, properties(n) AS _props, collect(prop) as properties')
    .then((response) => {
      return processRecord(response.records[0]);
    });
  },

  save: (template) => {
    const properties = template.properties.map((prop, index) => {
      prop.order = index;
      if (prop.nestedProperties) {
        prop.nestedProperties = JSON.stringify(prop.nestedProperties);
      }
      return prop;
    });
    delete template.properties;
    let queryString = 'CREATE (t:Template {template}) WITH t UNWIND {properties} as map CREATE (p:TemplateProperty), (t)-[:PROPERTY]->(p) SET p = map RETURN id(t) as id';
    return query(queryString, {template, properties})
    .then((response) => {
      let id = response.records[0].get('id').toInt();
      return templatesModel.getById(id);
    });
  }
};

export default templatesModel;

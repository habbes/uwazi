import {db_url as dbURL} from 'api/config/database';
import request from 'shared/JSONRequest';
import P from 'bluebird';
import templatesModel from 'api/templates/templatesModel';
import thesaurisModel from 'api/thesauris/thesaurisModel';
import model from 'api/neo4j/model';
import query from 'api/neo4j/query';

let limit = 50;
let documentsDone = 0;
let entitiesDone = 0;

const templatesIdMaps = {};

function migrateTemplate(_doc) {
  let doc = _doc;
  delete doc._rev;
  delete doc.type;
  doc.properties = doc.properties.map((prop) => {
    delete prop.inserting;
    return prop;
  });

  return templatesModel.save(doc)
  .then((template) => {
    templatesIdMaps[template._id] = template.id;
  });
}

function migrateDictionary(_doc) {
  let doc = _doc;
  delete doc._rev;
  delete doc.type;
  return thesaurisModel.save(doc);
}

function migrateEntity(_doc) {
  let doc = _doc;
  const entitiesModel = model('Entity');
  let oldTemplateId = _doc.template;
  delete doc._rev;
  delete doc.template;
  delete doc.type;
  delete doc.metadata;
  delete doc.user;
  delete doc.attachments;
  delete doc.icon;
  return entitiesModel.save(doc)
  .then((entity) => {
    const entityId = entity._id;
    const queryString = `MATCH (e:Entity) WHERE e._id ="${entityId}" MATCH (t:Template) WHERE t._id ="${oldTemplateId}" CREATE (e)-[:TEMPLATE]->(t) RETURN (e)-[:TEMPLATE]->(t)`;
    return query(queryString);
  });
}

function migrate(offset = 0) {
  return Promise.all([request.get(dbURL + '/_all_docs?limit=' + limit + '&skip=' + offset)])
  .then(([docsResponse]) => {
    if (offset >= docsResponse.json.total_rows) {
      return;
    }

    return P.resolve(docsResponse.json.rows).map((_doc) => {
      return request.get(dbURL + '/' + _doc.id)
      .then((response) => {
        let doc = response.json;
        documentsDone += 1;
        console.log (`${documentsDone} of ${docsResponse.json.total_rows}`);
        if (doc.type === 'template') {
          return migrateTemplate(doc);
        }

        if (doc.type === 'thesauri') {
          return migrateDictionary(doc);
        }
      });
    }, {concurrency: 1})
    .then(() => {
      return migrate(docsResponse.json.offset + limit);
    });
  })
  .catch((error) => {
    console.log('migrate', error);
  });
}

function migrateDocuments(offset = 0) {
  return Promise.all([request.get(dbURL + '/_all_docs?limit=' + limit + '&skip=' + offset)])
  .then(([docsResponse]) => {
    if (offset >= docsResponse.json.total_rows) {
      return;
    }

    return P.resolve(docsResponse.json.rows).map((_doc) => {
      return request.get(dbURL + '/' + _doc.id)
      .then((response) => {
        let doc = response.json;
        if (doc.type === 'entity') {
          entitiesDone += 1;
          console.log (`${entitiesDone} entities done`);
          return migrateEntity(doc);
        }
      });
    }, {concurrency: 1})
    .then(() => {
      return migrateDocuments(docsResponse.json.offset + limit);
    });
  })
  .catch((error) => {
    console.log('migrate', error);
  });
}

query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r')
.then(() => {
  return migrate();
})
.then(() => {
  console.log('=== now documents ===');
  return migrateDocuments();
});

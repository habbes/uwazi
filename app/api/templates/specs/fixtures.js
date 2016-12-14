export default {
  "docs":[
    {"_id":"c08ef2532f0bd008ac5174b45e033c93", "type":"template","name":"template_test", "properties": [{type: "select", "content": "thesauri1"}]},
    {"_id":"c08ef2532f0bd008ac5174b45e033c94", "type":"template","name":"template_test2"},
    {"_id":"c08ef2532f0bd008ac5174b45e033c95", "type":"thesauri","name":"thesauri"},
    {"_id":"c08ef2532f0bd008ac5174b45e033c96", "type":"entity","title":"entity1"},
    {"_id":"c08ef2532f0bd008ac5174b45e033c97", "type":"entity","title":"entity2"},
    // metadata property name changes
    {"_id":"d0298a48d1221c5ceb53c48793015080", "type":"document","title":"doc1", "template": 'template1', "metadata": {"property1": 'value1', "property2": 'value2', "property3": 'value3'}},
    {"_id":"d0298a48d1221c5ceb53c48793015081", "type":"document","title":"doc2", "template": 'template1', "metadata": {"property1": 'value1', "property2": 'value2', "property3": 'value3'}},
    {"_id":"d0298a48d1221c5ceb53c48793015082", "type":"document","title":"doc3", "template": 'template2', "metadata": {"property1": 'value1', "property2": 'value2', "property3": 'value3'}}
  ],
  "neo4j": [
    '(t:Template {name: "Judge", _id: "abc1"})',
    '(p0:TemplateProperty {name: "Name", order: 2, _id: "p0"})',
    '(p1:TemplateProperty {name:"Surname", order: 0, _id: "p1"})',
    '(p2:TemplateProperty {name:"Dob", order: 1, _id: "p2"})',
    '(t)-[:PROPERTY]->(p0)',
    '(t)-[:PROPERTY]->(p1)',
    '(t)-[:PROPERTY]->(p2)',
    '(p3:TemplateProperty {name:"Mechanism", order: 0, _id: "p3"})',
    '(h:Template {name: "Mechanism", _id: "abc2"})',
    '(p3)-[:CONTENT]->(h)'
  ]
};

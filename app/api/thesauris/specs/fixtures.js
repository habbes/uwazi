export default {
  "docs":[
    {"_id":"c08ef2532f0bd008ac5174b45e033c93", "type":"thesauri","name":"secret recipes", "values":[{"id":"1", "label": "Secret pizza recipe"}, {"id":"2", "label": "secret pasta recipe"}]},
    {"_id":"c08ef2532f0bd008ac5174b45e033c94", "type":"thesauri","name":"Top 2 scify books", "values": [{"id":"1", "label": "Enders game"},{"id":"2", "label": "Fundation"}]},
    {"_id":"templateID", "type":"template","name":"Judge", "properties": [], isEntity: true},
    {"_id":"entityID", "sharedId": "sharedId", "language": 'es', "type":"entity","title":"Dredd", "metadata": [], template: "templateID", icon: "Icon"}
  ],
  "neo4j": [
    '(d:Dictionary {name: "Countries", _id: "countries"})',
    '(d2:Dictionary {name: "Types", _id: "types"})',
    '(p0:DictionaryValue {label: "Spain", id: "abc2"})',
    '(p1:DictionaryValue {label: "Ecuador", id: "abc3"})',
    '(p2:DictionaryValue {label: "Orphan", id: "abc4"})',
    '(d)-[:VALUE]->(p0)',
    '(d)-[:VALUE]->(p1)',
    '(t:Template {name: "Mechanism", isEntity: true})',
    '(t2:Template {name: "Judges", isEntity: true})',
    '(e:Entity {title: "National Court", sharedId: "abc1", icon: "Something", language: "en"})',
    '(e2:Entity {title: "Corte Nacional", sharedId: "abc1", icon: "Something", language: "es"})',
    '(e)-[:TEMPLATE]->(t)',
    '(e2)-[:TEMPLATE]->(t)',
    '(e3:Entity {title: "english", sharedId: "abc2", language: "en"})',
    '(e4:Entity {title: "spanish", sharedId: "abc2", language: "es"})',
    '(e3)-[:TEMPLATE]->(t)',
    '(e4)-[:TEMPLATE]->(t)'
  ]
};

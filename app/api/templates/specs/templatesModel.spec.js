import templatesModel from 'api/templates/templatesModel';
import query from 'api/neo4j/query';
import {catchErrors} from 'api/utils/jasmineHelpers';

fdescribe('templates model', () => {

  beforeEach((done) => {
    query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r')
    .then(() => {
      return query('CREATE (t:Template {name: "Judge", _id: "abc1"}), ' +
                   '(p0:TemplateProperty {name: "Name", order: 2}), ' +
                   '(p1:TemplateProperty {name:"Surname", order: 0}), ' +
                   '(p2:TemplateProperty {name:"Dob", order: 1}), ' +
                   '(t)-[:PROPERTY]->(p0), ' +
                   '(t)-[:PROPERTY]->(p1), ' +
                   '(t)-[:PROPERTY]->(p2)');
    })
    .then(() => {
      done();
    });
  });

  describe('get', () => {
    it('should return Templates nodes with its properties', (done) => {
      templatesModel.get()
      .then((response) => {
        expect(response.rows[0].name).toEqual('Judge');
        expect(response.rows[0].properties[0].name).toBe('Surname');
        expect(response.rows[0].properties[1].name).toBe('Dob');
        expect(response.rows[0].properties[2].name).toBe('Name');

        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('save', () => {
    it('should create a Template with its properties', (done) => {
      let template = {name: 'Mechanism', properties: [{name: 'Name'}, {name: 'Country'}]};
      templatesModel.save(template)
      .then((response) => {
        expect(response.name).toEqual('Mechanism');
        expect(response.properties[1].name).toBe('Country');
        expect(response.properties[1].order).toBe(1);
        expect(response.properties[1]._id).toBeDefined();
        done();
      })
      .catch(catchErrors(done));
    });
  });
});

import templatesModel from 'api/templates/templatesModel';
import query from 'api/neo4j/query';
import {catchErrors} from 'api/utils/jasmineHelpers';
import fixtures from './fixtures';
import neo4jdb from 'api/utils/neo4jdb.js';

describe('templates model', () => {
  beforeEach((done) => {
    neo4jdb.resetTestingDatabase()
    .then(() => neo4jdb.import(fixtures))
    .then(done);
  });

  describe('get', () => {
    it('should return Templates nodes with its properties', (done) => {
      templatesModel.get()
      .then((response) => {
        expect(response.rows[0].name).toEqual('Mechanism');
        expect(response.rows[1].name).toEqual('Judge');
        expect(response.rows[1].properties[0].name).toBe('Surname');
        expect(response.rows[1].properties[1].name).toBe('Dob');
        expect(response.rows[1].properties[2].name).toBe('Name');

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

    it('should update an existing Template with its properties', (done) => {
      templatesModel.getById('abc1')
      .then((response) => {
        let template = response.rows[0];
        template.properties[1].name = 'Date of birth';
        template.properties.splice(0, 1);
        return templatesModel.save(template);
      })
      .then(() => templatesModel.getById('abc1'))
      .then((response) => {
        let template = response.rows[0];
        expect(template.properties.length).toBe(2);
        expect(template.properties[0].name).toBe('Date of birth');
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('delete', () => {
    it('should delete the template and return "ok"', (done) => {
      templatesModel.delete('abc1')
      .then((response) => {
        expect(response).toBe('ok');
        return query('MATCH (n) RETURN count(n) as count');
      })
      .then((response) => {
        expect(response.records[0].get('count').toInt()).toBe(1);
        done();
      })
      .catch(catchErrors(done));
    });
  });
});

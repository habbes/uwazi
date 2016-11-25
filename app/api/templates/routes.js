import {db_url as dbURL} from '../config/database.js';
import request from 'shared/JSONRequest.js';
import templates from './templates';
import needsAuthorization from '../auth/authMiddleware';
import model from 'api/neo4j/model';

export default app => {
  app.post('/api/templates', needsAuthorization, (req, res) => {
    templates.save(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({error});
    });
  });

  app.get('/api/templates', (req, res) => {
    // let id = '';
    // if (req.query && req.query._id) {
    //   id = '?key="' + req.query._id + '"';
    // }
    //
    // let url = dbURL + '/_design/templates/_view/all' + id;
    //
    // request.get(url)
    // .then((response) => {
    //   response.json.rows = response.json.rows.map((row) => row.value);
    //   res.json(response.json);
    // })
    // .catch((error) => {
    //   res.json({error: error.json});
    // });

    let templatesmodel = model('Template');
    return templatesmodel.get()
    .then((response) => {
      res.json(response);
    });
  });

  app.delete('/api/templates', needsAuthorization, (req, res) => {
    templates.delete(req.query)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({error: error.json});
    });
  });

  app.get('/api/templates/count_by_thesauri', (req, res) => {
    templates.countByThesauri(req.query._id)
    .then((response) => {
      res.json(response);
    });
  });

  app.get('/api/templates/select_options', (req, res) => {
    templates.selectOptions().then((response) => res.json(response));
  });
};

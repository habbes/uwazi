import templates from './templates';
import needsAuthorization from '../auth/authMiddleware';
import templatesModel from './templatesModel';

export default app => {
  app.post('/api/templates', needsAuthorization, (req, res) => {
    return templatesModel.save(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error, 500);
    });
  });

  app.get('/api/templates', (req, res) => {
    if (req.query && req.query._id) {
      return templatesModel.getById(req.query._id)
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        res.json(error, 500);
      });
    }

    return templatesModel.get()
    .then((response) => {
      res.json(response);
    }).catch((error) => {
      res.json(error, 500);
    });
  });

  app.delete('/api/templates', needsAuthorization, (req, res) => {
    templatesModel.delete(req.query)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error, 500);
    });
  });

  app.get('/api/templates/count_by_thesauri', (req, res) => {
    templates.countByThesauri(req.query._id)
    .then((response) => {
      res.json(response);
    });
  });
};

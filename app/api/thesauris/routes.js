import needsAuthorization from '../auth/authMiddleware';
import thesauris from './thesauris';
import thesaurisModel from './thesaurisModel';

export default app => {
  app.post('/api/thesauris', needsAuthorization, (req, res) => {
    thesauris.save(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({error: error});
    });
  });

  app.get('/api/thesauris', (req, res) => {
    let action = thesaurisModel.get.bind(thesaurisModel, req.language);
    if (req.query && req.query._id) {
      action = thesaurisModel.getById.bind(thesaurisModel, req.query._id);
    }
    return action()
    .then((response) => {
      res.json(response);
    }).catch((error) => {
      res.json(error, 500);
    });
  });

  app.get('/api/dictionaries', (req, res) => {
    let id;
    if (req.query) {
      id = req.query._id;
    }
    thesauris.dictionaries(id)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({error: error.json});
    });
  });

  app.delete('/api/thesauris', needsAuthorization, (req, res) => {
    thesaurisModel.delete(req.query._id)
    .then(res.json)
    .catch(error => {
      res.json(error, 500);
    });
  });
};

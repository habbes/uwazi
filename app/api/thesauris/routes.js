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
    return thesaurisModel.get()
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
    thesauris.delete(req.query._id, req.query._rev)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({error: error.json});
    });
  });
};

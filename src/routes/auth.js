const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const router = require('express').Router();
const ValidationError = require('../errors/ValidationError');

const secret = 'Segredo!';

module.exports = (app) => {
  router.post('/signin', (req, res, next) => {
    const { mail, passwd } = req.body;

    app.services.user
      .findOne({ mail })
      .then((user) => {
        if (!user) throw new ValidationError('Usuário ou senha inválido');

        if (bcrypt.compareSync(passwd, user.passwd)) {
          const payload = {
            id: user.id,
            name: user.name,
            mail: user.mail,
          };
          const token = jwt.encode(payload, secret);
          res.status(200).json({ token });
        } else {
          throw new ValidationError('Usuário ou senha inválido');
        }
      })
      .catch(err => next(err));
  });

  router.post('/signup', async (req, res) => {
    try {
      // Obs.: mysql não retorna parâmetro ao inserir, somento o postgres
      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  return router;
};

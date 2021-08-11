const router = require('express').Router();
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');

module.exports = (app) => {

    router.get('/', (req, res, next) => {
        app.services.balance.getSaldo(req.user.id)
            .then(result => res.status(200).json(result))
            .catch(err => next(err));
    });

    return router;
};
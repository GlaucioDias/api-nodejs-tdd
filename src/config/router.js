const protectedRouter = require('express').Router();

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  protectedRouter.use('/users', app.routes.users);
  protectedRouter.use('/accounts', app.routes.accounts);
  protectedRouter.use('/transactions', app.routes.transactions);
  protectedRouter.use('/transfers', app.routes.transfers);
  protectedRouter.use('/balance', app.routes.balance);

  app.use('/v1', app.config.passport.authenticate(), protectedRouter);


  app.use('/v2', protectedRouter);
};

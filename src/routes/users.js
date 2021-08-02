const router = require('express').Router();
// const express = require('express');

module.exports = (app) => {
  // const router = express.Router();


  router.get('/', (req, res) => {
    app.services.user.findAll()
      .then(result => res.status(200).json(result))
  });

  router.post('/', async (req, res) => {
    try {
      const result = await app.services.user.save(req.body) //Obs.: mysql não retorna parâmetro ao inserir, somento o postgres
      return res.status(201).json(result[0]);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  return router;
}

module.exports = (app) => {

    const findAll = (req, res) => {            
        app.services.user.findAll().then(result => res.status(200).json(result))
      }
      
      const create = async (req, res) => {
        const result = await app.services.user.save(req.body) //Obs.: mysql não retorna parâmetro ao inserir, somento o postgres
        if(result.error) return res.status(400).json(result)
        res.status(201).json(result[0]);
      };

    return { findAll, create }
}
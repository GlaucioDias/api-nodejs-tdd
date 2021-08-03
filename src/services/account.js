const ValidationError = require('../errors/validationError');

module.exports = (app) => {
    const findAll = (userId) => {
        return app.db('accounts').where({ user_id: userId })
    }

    const find = (filter = {}) => {
        return app.db('accounts').where(filter).first();
    }
   
    const save = async (account) => { // async nessa linha transforma qualquer retorno desse método em algo tratado como promise
        if(!account.name) throw new ValidationError('Nome é um atributo obrigatório');

        const accDb = await find({ name: account.name, user_id: account.user_id });

        if(accDb) throw new ValidationError('Já existe uma conta com este nome');
        
        return app.db('accounts').insert(account, '*');
    };

    const update = (id, account) => {
        return app.db('accounts')
            .where({id})
            .update(account, '*');
    }

    const remove = (id) => {
        return app.db('accounts')
            .where({id})
            .del()
    }

    return { save, findAll, find, update, remove };
}
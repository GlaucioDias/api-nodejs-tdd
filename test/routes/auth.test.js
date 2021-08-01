const request = require('supertest');

const app = require('../../src/app');

test('Deve criar usuário via signup', () => {
    return request(app).post('/auth/signup')
        .send({name: 'Glaucio', mail: `${Date.now()}@teste.com.br`, passwd: '123456' })
        .then((res) => {
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('name');
            expect(res.body.name).toBe('Glaucio')
            expect(res.body).toHaveProperty('mail');
            expect(res.body).not.toHaveProperty('passwd');
        })
});

test('Deve receber token ao logar', () => {
    const mail = `${Date.now()}@teste.com.br`;

    return app.services.user.save(
        { name: "Paulo Eduardo", mail, passwd: '123456' }
    )
    .then(() => request(app).post('/auth/signin').send({mail, passwd: '123456'}))
     .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
     });   

});

test('Não deve autenticar usuário com senha inválida', () => {
    const mail = `${Date.now()}@teste.com.br`;

    return app.services.user.save(
        { name: "Paulo Eduardo", mail, passwd: '123456' }
    )
    .then(() => request(app).post('/auth/signin').send({mail, passwd: '654321'}))
     .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Usuário ou senha inválido');
     });   
});

test('Não deve autenticar usuário com senha inválida', () => {

    return request(app).post('/auth/signin').send({mail: 'naoexiste@teste.com.br', passwd: '654321'})
     .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Usuário ou senha inválido');
     });   
});

test('Não deve acessar uma rota protegida sem token', () => {
    return request(app).get('/users')
        .then((res) => {
            expect(res.status).toBe(401);

        });
});

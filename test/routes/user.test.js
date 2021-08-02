const request = require("supertest");
const jwt = require('jwt-simple');

const app = require("../../src/app");

const mail = `${Date.now()}@teste.com.br`;
const MAIN_ROUTE = '/v1/users';

let user;

beforeAll(async () => {
  const result = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@test.com`, passwd: '123456' })

  user = { ...result[0] };
  user.token = jwt.encode(user, 'Segredo!')
});

test("Deve listar todos os usuários", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Deve inserir um usuário com sucesso", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({ name: "Paulo Eduardo", mail, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Paulo Eduardo");
    });
});


test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: "Paulo Eduardo", mail: `${Date.now()}@teste.com.br`, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);

  const { id } = res.body;

  const userDb = await app.services.user.findOne({ id });
  expect(userDb.passwd).not.toBeUndefined();
  expect(userDb.passwd).not.toBe('123456');
})

test('Não deve inserir um usuário sem nome', () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({ mail: 'test@test.com', passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});

test('Não deve inseir usuário sem email', async () => {
  const result = await request(app)
    .post(MAIN_ROUTE)
    .send({ name: 'Glaucio', passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório');
});

test('Não deve inserir usuário sem senha', (done) => {
  request(app)
    .post(MAIN_ROUTE)
    .send({ name: 'Glaucio', mail: 'test@test.com' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório');
      done();
    })
    .catch(err => done.fail(err));
});

test('Não deve inserir usuário com email existente', () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({ name: "Paulo Eduardo", mail, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Já existe um usuário com esse email");
    });
});
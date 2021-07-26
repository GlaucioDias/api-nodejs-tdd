const request = require("supertest");

const app = require("../../src/app");

const mail = `${Date.now()}@teste.com.br`;

test("Deve listar todos os usuários",  () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      // expect(res.body[0]).toHaveProperty("name", "Pedro Henrique");
    });
});

test("Deve inserir um usuário com sucesso", () => {
  return request(app)
    .post("/users")
    .send({ name: "Paulo Eduardo", mail, passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Paulo Eduardo");
    });
});

test('Não deve inserir um usuário sem nome', () => {
  return request(app)
    .post('/users')
    .send({ mail: 'test@test.com', passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    })
});

test('Não deve inseir usuário sem email', async () => {
  const result = await request(app)
    .post('/users')
    .send({ name: 'Glaucio', passwd: '123456'})
  expect(result.status).toBe(400)
  expect(result.body.error).toBe('Email é um atributo obrigatório')
})

test('Não deve inserir usuário sem senha', (done) => {
  request(app)
    .post('/users')
    .send({ name: 'Glaucio', mail: 'test@test.com' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório');
      done();
    })
    .catch(err => done.fail(err));
})

test('Não deve inserir usuário com email existente', () => {
  return request(app)
    .post("/users")
    .send({ name: "Paulo Eduardo", mail, passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Já existe um usuário com esse email");
    });
})
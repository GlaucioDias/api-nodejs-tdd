const request = require("supertest");

const app = require("../../src/app");

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
  const mail = `${Date.now()}@teste.com.br`;
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

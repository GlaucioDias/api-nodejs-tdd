const request = require("supertest");
const moment = require('moment');

const app = require("../../src/app");
const MAIN_ROUTE = "/v1/balance";
const TRANSACTION_ROUTE = "/v1/transactions";
const TRANSFER_ROUTE = "/v1/transfers";
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxMDAsIm5hbWUiOiJVc2VyICMzIiwibWFpbCI6InVzZXIzQHRlc3QuY29tIn0.oW2xvSr69ZsoPnqEXtQ3y3t0iuj3OuubWT5cpSA_nBk';


beforeAll(async () => {
    await app.db.seed.run();
});

describe('Ao calcular o saldo do usuário...', () => {
    test('Deve retornar apenas as contas com alguma transação', () => {
        return request(app).get(MAIN_ROUTE)
            .set('authorization', `bearer ${TOKEN}`)
            .then((res) => {
                expect(res.status).toBe(200)
                expect(res.body).toHaveLength(0)
            });
    });

    test('Deve adicionar valores de entrada', () => {
        return request(app).post(TRANSACTION_ROUTE)
            .set('authorization', `bearer ${TOKEN}`)
            .send({ description: '1', date: new Date(), amount: 100, type: 'I', acc_id: 10100, status: true })
            .then(() => {
                return request(app).get(MAIN_ROUTE)
                    .set('authorization', `bearer ${TOKEN}`)
                    .then((res) => {
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveLength(1);
                        expect(res.body[0].id).toBe(10100);
                        expect(res.body[0].sum).toBe('100.00');
                    });
            });
    });

    test('Deve subtrair valores de saída', () => {
        return request(app).post(TRANSACTION_ROUTE)
            .set('authorization', `bearer ${TOKEN}`)
            .send({ description: '1', date: new Date(), amount: 200, type: 'O', acc_id: 10100, status: true })
            .then(() => {
                return request(app).get(MAIN_ROUTE)
                    .set('authorization', `bearer ${TOKEN}`)
                    .then((res) => {
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveLength(1);
                        expect(res.body[0].id).toBe(10100);
                        expect(res.body[0].sum).toBe('-100.00');
                    });
            });
    });

    test('Nâo deve considerar transações pendentes', () => {
        return request(app).post(TRANSACTION_ROUTE)
            .set('authorization', `bearer ${TOKEN}`)
            .send({ description: '1', date: new Date(), amount: 100, type: 'O', acc_id: 10100, status: false })
            .then(() => {
                return request(app).get(MAIN_ROUTE)
                    .set('authorization', `bearer ${TOKEN}`)
                    .then((res) => {
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveLength(1);
                        expect(res.body[0].id).toBe(10100);
                        expect(res.body[0].sum).toBe('-100.00');
                    });
            });
    });

    test('Nâo deve considerar saldo de contas distintas', () => {
        return request(app).post(TRANSACTION_ROUTE)
            .set('authorization', `bearer ${TOKEN}`)
            .send({ description: '1', date: new Date(), amount: 50, type: 'I', acc_id: 10101, status: true })
            .then(() => {
                return request(app).get(MAIN_ROUTE)
                    .set('authorization', `bearer ${TOKEN}`)
                    .then((res) => {
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveLength(2);
                        expect(res.body[0].id).toBe(10100);
                        expect(res.body[0].sum).toBe('-100.00');
                        expect(res.body[1].id).toBe(10101);
                        expect(res.body[1].sum).toBe('50.00');
                    });
            });
    });

    test('Nâo deve considerar contas de outros usuários', () => {
        return request(app).post(TRANSACTION_ROUTE)
            .set('authorization', `bearer ${TOKEN}`)
            .send({ description: '1', date: new Date(), amount: 100, type: 'O', acc_id: 10102, status: true })
            .then(() => {
                return request(app).get(MAIN_ROUTE)
                    .set('authorization', `bearer ${TOKEN}`)
                    .then((res) => {
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveLength(1);
                        expect(res.body[0].id).toBe(10100);
                        expect(res.body[0].sum).toBe('-100.00');
                        expect(res.body[1].id).toBe(10101);
                        expect(res.body[1].sum).toBe('50.00');
                    });
            });
    });

    test('Deve considerar uma transação passada', () => {
        return request(app).post(TRANSACTION_ROUTE)
            .set('authorization', `bearer ${TOKEN}`)
            .send({ description: '1', date: moment().subtract({ days: 5 }), amount: 250, type: 'I', acc_id: 10100, status: true })
            .then(() => {
                return request(app).get(MAIN_ROUTE)
                    .set('authorization', `bearer ${TOKEN}`)
                    .then((res) => {
                        expect(res.status).toBe(200);
                        expect(res.body).toHaveLength(2);
                        expect(res.body[0].id).toBe(10100);
                        expect(res.body[0].sum).toBe('150.00');
                        expect(res.body[1].id).toBe(10101);
                        expect(res.body[1].sum).toBe('50.00');
                    });
            });
    });

    test('Não deve considerar uma transação futura', () => { 
        return request(app).post(TRANSACTION_ROUTE)
        .set('authorization', `bearer ${TOKEN}`)
        .send({ description: '1', date: moment().add({ days: 5 }), amount: 250, type: 'I', acc_id: 10100, status: true })
        .then(() => {
            return request(app).get(MAIN_ROUTE)
                .set('authorization', `bearer ${TOKEN}`)
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveLength(2);
                    expect(res.body[0].id).toBe(10100);
                    expect(res.body[0].sum).toBe('150.00');
                    expect(res.body[1].id).toBe(10101);
                    expect(res.body[1].sum).toBe('50.00');
                });
        });
    });

    test('Deve considerar transferências', () => { 
        return request(app).post(TRANSFER_ROUTE)
        .set('authorization', `bearer ${TOKEN}`)
        .send({ description: '1', date: moment(), amount: 250, acc_ori_id: 10100, acc_dest_id: 10101 })
        .then(() => {
            return request(app).get(MAIN_ROUTE)
                .set('authorization', `bearer ${TOKEN}`)
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveLength(2);
                    expect(res.body[0].id).toBe(10100);
                    expect(res.body[0].sum).toBe('-100.00');
                    expect(res.body[1].id).toBe(10101);
                    expect(res.body[1].sum).toBe('200.00'); //300.00
                });
        });
    });
})
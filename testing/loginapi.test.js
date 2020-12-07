// const { sequelize:DBOLTP } = require("../../src/database/database");
const request = require('supertest');
const { default: app } = require('../src/app');

test('Intentado iniciar sesión a la API: Respuesta Correcta', async() => {
    await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    })
    .expect(200)
});
test('Intentado iniciar sesión a la API: Rol Invalido', async() => {
        await request(app).post('/api/auth')
        .send({
            "Rut":"00.000.000-0",
            "Password":"123456",
            "Id_rol":null
        })
        .expect(422)
});
test('Intentado iniciar sesión a la API: Rut Invalido', async() => {
        await request(app).post('/api/auth')
        .send({
            "Rut":"00.000.000-1A",
            "Password":"123456",
            "Id_rol":1
        })
        .expect(422)
});
test('Intentado iniciar sesión a la API: Password Invalido', async() => {
        await request(app).post('/api/auth')
        .send({
            "Rut":"00.000.000-0",
            "Password":"AAA",
            "Id_rol":1
        })
        .expect(422)
});
test('Intentado iniciar sesión a la API: Campos Invalidos', async() => {
        await request(app).post('/api/auth')
        .send({
            // "Rut":"00.000.000-0",
            "Password":"AAA",
            "Id_rol":1
        })
        .expect(422)
});

test('Verificar Token: Erroneo', async() => {
    await request(app).get('/api/vauth')
    .set('user-token', "a")
    .expect(422)
})
test('Verificar Token: Expirado', async() => {
    await request(app).get('/api/vauth')
    .set('user-token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiIwMC4wMDAuMDAwLTAiLCJyb2wiOjEsImNyZWF0ZWRBdCI6MTYwNzMyODYyNSwiZXhwaXJlZEF0IjoxNjA3MzMyMjI1fQ.GLx-Ol_kU_MftWzAWCSKgSjkLN3hJuNYIontsh8lsvw")
    .expect(422)
})
test('Verificar Token: Sin header', async() => {
    await request(app).get('/api/vauth')
    .expect(422)
})
test('Verificar Token: Correcto', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).get('/api/vauth')
    .set('user-token', token.body.success)
    .expect(200)
})
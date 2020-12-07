// const { sequelize:DBOLTP } = require("../../src/database/database");
const request = require('supertest');
const { default: app } = require('../src/app');

test('CRUD USUARIOS: Correcto', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).post('/api/registrarusuario')
    .set('user-token', token.body.success)
    .send({
        "Rut":"19.767.283-8",
        "Nombre":"Diego",
        "Apellidos":"tapia zapata",
        "Correo_electronico":"diegogmailcom",
        "Estado":1,
        "Cargo":"Desarrollador",
        "Id_empresa":1,
        "Id_rol":1
    })
    // .then(value => (console.log(value.body)))
    .expect(200)
})

test('CRUD USUARIOS: Usuario ya existente', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).post('/api/registrarusuario')
    .set('user-token', token.body.success)
    .set('Accept', 'application/json')
    .send({
        "Rut":"19.767.283-8",
        "Nombre":1,
        "Apellidos":"tapia zapata",
        "Correo_electronico":"diegogmailcom",
        "Estado":1,
        "Cargo":"Desarrollador",
        "Id_empresa":1,
        "Id_rol":1
    })
    // .then(value => console.log(value.body))
    .expect(422)
    
})

test('CRUD USUARIOS: Campo Nulo', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).post('/api/registrarusuario')
    .set('user-token', token.body.success)
    .send({
        "Rut":"19.767.283-8",
        // "Nombre":1,
        "Apellidos":"tapia zapata",
        "Correo_electronico":"diegogmailcom",
        "Estado":1,
        "Cargo":"Desarrollador",
        "Id_empresa":1,
        "Id_rol":1
    })
    .expect(422)
})

test('CRUD USUARIOS: Id empresa Nulo', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).post('/api/registrarusuario')
    .set('user-token', token.body.success)
    .send({
        "Rut":"19.767.283-8",
        "Nombre":1,
        "Apellidos":"tapia zapata",
        "Correo_electronico":"diegogmailcom",
        "Estado":1,
        "Cargo":"Desarrollador",
        "Id_empresa":10000,
        "Id_rol":1
    })
    .expect(422)
})

test('CRUD USUARIOS: Id Rol Nulo', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).post('/api/registrarusuario')
    .set('user-token', token.body.success)
    .send({
        "Rut":"19.767.283-8",
        "Nombre":1,
        "Apellidos":"tapia zapata",
        "Correo_electronico":"diegogmailcom",
        "Estado":1,
        "Cargo":"Desarrollador",
        "Id_empresa":1,
        "Id_rol":1000000
    })
    .expect(422)
})

test('CRUD USUARIOS: Estado No boleano', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).post('/api/registrarusuario')
    .set('user-token', token.body.success)
    .set('Accept', 'application/json')
    .send({
        "Rut":"19.767.283-8",
        "Nombre":1,
        "Apellidos":"tapia zapata",
        "Correo_electronico":"diegogmailcom",
        "Estado":12,
        "Cargo":"Desarrollador",
        "Id_empresa":1,
        "Id_rol":1
    })
    
    // .then(value => console.log(value.body))
    .expect(422)
})

test('CRUD USUARIOS: Modificar Correcto', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).put('/api/users/19.767.283-8')
    .set('user-token', token.body.success)
    .set('Accept', 'application/json')
    .send({
        "Rut":"19.767.283-8",
        "Nombre":"diego PRUEBA1",
        "Apellidos":"el apellido test2",
        "Estado":1,
        "Correo_electronico":"diego2@gmail.com",
        "Cargo":"Desarrollador",
        "Id_empresa":1
    })
    
    // .then(value => console.log(value.body))
    .expect(200)
})

test('CRUD USUARIOS: Modificar Parametro Rut Erroneo', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).put('/api/users/19.767.283-7')
    .set('user-token', token.body.success)
    .set('Accept', 'application/json')
    .send({
        "Rut":"19.767.283-8",
        "Nombre":"diego PRUEBA1",
        "Apellidos":"el apellido test2",
        "Estado":1,
        "Correo_electronico":"diego2@gmail.com",
        "Cargo":"Desarrollador",
        "Id_empresa":1
    })
    
    // .then(value => console.log(value.body))
    .expect(422)
})

test('CRUD USUARIOS: Modificar Parametro Rut Nulo', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).put('/api/users/')
    .set('user-token', token.body.success)
    .set('Accept', 'application/json')
    .send({
        "Nombre":"diego PRUEBA1",
        "Apellidos":"el apellido test2",
        "Estado":1,
        "Correo_electronico":"diego2@gmail.com",
        "Cargo":"Desarrollador",
        "Id_empresa":1
    })
    
    // .then(value => console.log(value.body))
    .expect(404)
})

test('CRUD USUARIOS: Modificar Id empresa Nulo', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).put('/api/users/19.767.283-8')
    .set('user-token', token.body.success)
    .set('Accept', 'application/json')
    .send({
        "Nombre":"diego PRUEBA1",
        "Apellidos":"el apellido test2",
        "Estado":1,
        "Correo_electronico":"diego2@gmail.com",
        "Cargo":"Desarrollador",
        "Id_empresa":10000000
    })
    
    // .then(value => console.log(value.body))
    .expect(422)
})

test('CRUD USUARIOS: Modificar Estado Nulo', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).put('/api/users/19.767.283-8')
    .set('user-token', token.body.success)
    .set('Accept', 'application/json')
    .send({
        "Nombre":"diego PRUEBA1",
        "Apellidos":"el apellido test2",
        "Estado":12,
        "Correo_electronico":"diego2@gmail.com",
        "Cargo":"Desarrollador",
        "Id_empresa":1
    })
    .expect(422)
})

test('CRUD USUARIOS: Modificar Campo Nulo', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).put('/api/users/19.767.283-8')
    .set('user-token', token.body.success)
    .set('Accept', 'application/json')
    .send({
    })
    .expect(422)
})



test('CRUD USUARIOS: Borrar Usuario', async() => {
    const token= await request(app).post('/api/auth')
    .send({
        "Rut":"00.000.000-0",
        "Password":"123456",
        "Id_rol":1
    });
    await request(app).delete('/api/registrarusuario/19.767.283-8')
    .set('user-token', token.body.success)
    .expect(200)
    
})

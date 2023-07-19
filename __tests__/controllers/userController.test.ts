import supertest from 'supertest';
import { afterAll, jest } from '@jest/globals';
import { Model, Sequelize } from 'sequelize';

import app from '../../src/app';

import DatabaseProvider from '../../src/models';

const {
    sequelize,
    User
} = DB

//Mocks

//sequelize 
jest.mock('sequelize', () => {
    const actualSequelize: any = jest.requireActual('sequelize');
    const mModel = {
        findOne: jest.fn(() => {}),
        findAll: jest.fn(() => []),
        getTableName: jest.fn(() => "tbl_test"),
        count: jest.fn(() => 0),
        create: jest.fn(),
        update: jest.fn(() => []),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
        belongsToMany: jest.fn(),
        init: (name: any, attributes: any) => {
            class MockModel extends Model<any, any> {}
            MockModel.init(attributes, { sequelize: sequelize, modelName: name });
            return MockModel;
        }
    }
    
    const mSequelize: any = {
        authenticate: jest.fn(),
        define: jest.fn(() => {
           return {
            findOne: jest.fn(() => {}),
            findAll: jest.fn(() => []),
            getTableName: jest.fn(() => "tbl_test"),
            count: jest.fn(() => 0),
            create: jest.fn(),
            update: jest.fn(() => []),
            hasMany: jest.fn(),
            belongsTo: jest.fn(),
            belongsToMany: jest.fn()
           } 
        })
    };
    return { 
       Sequelize: jest.fn(() => mSequelize),
       DataTypes: actualSequelize.DataTypes,
       Model: jest.fn(() => mModel),
       Op: actualSequelize.Op 
     };
});
//Models
jest.mock('../../src/models/sequelize/Users/', () => (sequelize: Sequelize) => {
    return {
        findOne: jest.fn(() => {}),
        findAll: jest.fn(() => []),
        getTableName: jest.fn(() => "tbl_test"),
        count: jest.fn(() => 0),
        create: jest.fn(),
        update: jest.fn(() => []),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
        belongsToMany: jest.fn(),
       } 
    }
);
jest.mock('../../src/models/sequelize/Roles/', () => (sequelize: Sequelize) => {
    return {
        findOne: jest.fn(() => {}),
        findAll: jest.fn(() => []),
        getTableName: jest.fn(() => "tbl_test"),
        count: jest.fn(() => 0),
        create: jest.fn(),
        update: jest.fn(() => []),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
        belongsToMany: jest.fn(),
       } 
    }
);
jest.mock('../../src/models/sequelize/relations/UsersRoles', () => (sequelize: Sequelize) => {
    return {
        findOne: jest.fn(() => {}),
        findAll: jest.fn(() => []),
        getTableName: jest.fn(() => "tbl_test"),
        count: jest.fn(() => 0),
        create: jest.fn(),
        update: jest.fn(() => []),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
        belongsToMany: jest.fn(),
       } 
    }
);

beforeEach(() => {
    jest.resetAllMocks();
});

const server = app.listen(app.get("port"), () => {
    return console.log("Server on port ", app.get("port"));
});

const api = supertest(app);

describe('User model', () => {
    afterAll(() => {
        server.close();
    })
    
    it('should find a record', async () => {
        const record = { id: 1, name: 'John Doe' };
        User.findOne = jest.fn(() => Promise.resolve(record));
    
        const result = await User.findOne({
            where: {
                user_id: 1
            }
        });
    
        expect(User.findOne).toHaveBeenCalledWith({ where: { user_id: 1 } });
        expect(result).toEqual(record);
    });
  });


//     it("Should not create a new user with invalid body", async () => {
//         return await api.post("/users/register")
//             .send({})
//             .then((res) => expect(res.status).toBe(400))
//     });

//     it("Should not create a new user without password", async () => {
//         return await api.post("/users/register")
//             .send({
//                 nombre: users[0].nombre,
//                 apellidos: users[0].apellidos,
//                 correo: users[0].correo,
//                 rol_id: users[0].rol_id
//             })
//             .then((res) => expect(res.status).toBe(400))
//     });

//     it("Should not create a new user without name", async () => {
//         return await api.post("/users/register")
//             .send({               
//                 correo: users[0].correo,
//                 apellidos: users[0].apellidos,
//                 contraseña: users[0].contraseña,
//                 rol_id: users[0].rol_id
//             })
//             .then((res) => expect(res.status).toBe(400))
//     });

//     it("Should not create a new user without lastnames", async () => {
//         return await api.post("/users/register")
//             .send({
//                 nombre: users[0].nombre,                
//                 correo: users[0].correo,
//                 contraseña: users[0].contraseña,
//                 rol_id: users[0].rol_id
//             })
//             .then((res) => expect(res.status).toBe(400))
//     });

//     it("Should create a new user", async () => {
//         const expectedResponse = "usuario con roles registrado correctamente";
//         const data = {
//             nombre: users[0].nombre,
//             apellidos: users[0].apellidos,
//             correo: users[0].correo,
//             contraseña: users[0].contraseña,
//             rol_id: users[0].rol_id
//         };
//         return await api.post("/users/register")
//             .send(data)
//             .then((res: Response) => {
//                 expect(res.text).toContain(`"${expectedResponse}"`);
//                 expect(res.statusCode).toBe(200);
//             })
//             .catch((err: Error) => { 
//                 throw err; 
//             });

//     });

// });


import supertest from 'supertest';
import { afterAll, jest } from '@jest/globals';
import { Model, Sequelize } from 'sequelize';

import app from '../../../../src/app';

import DatabaseProvider from '../../../../src/models';

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
jest.mock('../../../../src/models/sequelize/Users/', () => (sequelize: Sequelize) => {
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
jest.mock('../../../../src/models/sequelize/Roles/', () => (sequelize: Sequelize) => {
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
jest.mock('../../../../src/models/sequelize/relations/UsersRoles', () => (sequelize: Sequelize) => {
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
    
    it('should find a user', async () => {
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

import { InferCreationAttributes, InferAttributes, Model, Sequelize, ForeignKey } from 'sequelize';
//associations
import { Rol } from '../../Roles/';
import { User } from '../../Users/';

export class UsersRoles extends Model<InferAttributes<UsersRoles>, InferCreationAttributes<UsersRoles>> {
    declare user_id: ForeignKey<User['user_id']>;
    declare rol_id: ForeignKey<Rol['rol_id']>;
}

export type UsersRolesSequelizeEntity = typeof UsersRoles;

export default (sequelize: Sequelize): UsersRolesSequelizeEntity => {
    return UsersRoles.init({}, {  
        sequelize: sequelize, 
        tableName: 'tbl_users_roles', 
        timestamps: false 
    });
}

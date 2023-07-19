import { ConnectionProvider } from '../utils/database';
import { Sequelize } from 'sequelize';
//models
import UserModel, { UserSequelizeEntity } from './sequelize/Users';
import RoleModel, { RolSequelizeEntity } from './sequelize/Roles';
//many to many tables
import UsersRolesModel, { UsersRolesSequelizeEntity } from './sequelize/relations/UsersRoles/';

type IDatabaseProvider = {
    sequelize: Sequelize;
    User: UserSequelizeEntity;
    Role: RolSequelizeEntity;
    Users_Roles: UsersRolesSequelizeEntity;
}

const connection = new ConnectionProvider();
const sequelize = connection.getConnection();

const User = UserModel(sequelize);
const Role = RoleModel(sequelize);
const UsersRoles = UsersRolesModel(sequelize);

//relations 

//users roles
Role.belongsToMany(User, {
    through: UsersRoles, as: 'users', foreignKey: 'rol_id'
});

User.belongsToMany(Role, {
    through: UsersRoles, as: 'roles', foreignKey: 'user_id'
});


const DatabaseProvider: IDatabaseProvider = {
    sequelize: sequelize,
    User: User,
    Role: Role,
    Users_Roles: UsersRoles
}

export default DatabaseProvider;


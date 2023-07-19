import { 
    CreationOptional, 
    DataTypes, 
    Model, 
    NonAttribute, 
    Optional, 
    Sequelize, 
    BelongsToMany,
    BelongsToManyAddAssociationMixin, 
    BelongsToManyCountAssociationsMixin, 
    BelongsToManyCreateAssociationMixin, 
    BelongsToManyGetAssociationsMixin, 
    BelongsToManyHasAssociationMixin, 
    BelongsToManySetAssociationsMixin, 
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin
} from 'sequelize';

import { Rol } from '../Roles/';

export interface UserAttributes {
    user_id: number;
    name: string;
    lastnames: string;
    mail: string;
    password: string;
    photo_path?: string;
    created_at?: Date;
    created_by?: number;
    updated_at?: Date;
    updated_by?: number;
    deleted_at?: Date;
    deleted_by?: number
    ;
}

// Optional properties, sequelize has the ability to fill these in itself
interface UserCreationAttributes extends Optional<UserAttributes,  "user_id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
    declare user_id: CreationOptional<number>;
    declare name: string;
    declare lastnames: string;
    declare mail: string;
    declare password: string;
    declare photo_path: CreationOptional<string>;

    //audit columns
    declare created_at: CreationOptional<Date>;
    declare created_by: CreationOptional<number>;
    declare updated_at: CreationOptional<Date>;
    declare updated_by: CreationOptional<number>;
    declare deleted_at: CreationOptional<Date>;
    declare deleted_by: CreationOptional<number>;

    public get Name(): NonAttribute<string> {
        return this.name
    }

    public get lastNames(): NonAttribute<string> {
        return this.lastnames
    }

    public get Mail(): NonAttribute<string> {
        return this.name
    }

    public get Password(): NonAttribute<string> {
        return this.password
    }

    public get PhotoPath(): NonAttribute<string> {
        return this.photo_path
    }

    //sequelize associations
        
    public readonly roles?: NonAttribute<Rol[]>;  

    public getRoles!: BelongsToManyGetAssociationsMixin<Rol>; 
    public addRole!: BelongsToManyAddAssociationMixin<Rol, number>;
    public createRoles!: BelongsToManyCreateAssociationMixin<Rol>;
    public setRoles!: BelongsToManySetAssociationsMixin<Rol, number>;
    public deleteRole!: BelongsToManyRemoveAssociationMixin<Rol, number>;
    public deleteRoles!: BelongsToManyRemoveAssociationsMixin<Rol, number>;
    public hasRole!: BelongsToManyHasAssociationMixin<Rol, number>;
    public countRoles!: BelongsToManyCountAssociationsMixin;

    public countCompanies!: BelongsToManyCountAssociationsMixin;

    public static associations: {
        roles: BelongsToMany<User, Rol>;
    };
}

export type UserSequelizeEntity = typeof User;

export default (sequelize: Sequelize): UserSequelizeEntity => {
    const Model: UserSequelizeEntity = User.init(
        {
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: new DataTypes.STRING(20),
                allowNull: false
            },
            lastnames: {
                type: new DataTypes.STRING(20),
                allowNull: false
            },
            mail: {
                type: new DataTypes.STRING(20),
                allowNull: false
            },
            password: {
                type: new DataTypes.STRING(20),
                allowNull: false
            },
            photo_path: {
                type: new DataTypes.STRING(20),
                allowNull: true
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
            created_by: DataTypes.INTEGER.UNSIGNED,
            updated_by: DataTypes.INTEGER.UNSIGNED,
            deleted_by: DataTypes.INTEGER.UNSIGNED
        },
        {  
            sequelize: sequelize, 
            paranoid: true,
            tableName: 'tbl_users',  
            updatedAt: 'updated_at',
            createdAt: 'created_at',
            deletedAt: 'deleted_at'
        }
    );
    return Model;
}
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
import { User } from '../Users/';

export interface RolAttributes {
    rol_id: number;
    rol: string;
    created_at?: Date;
    created_by?: number;
    updated_at?: Date;
    updated_by?: number;
    deleted_at?: Date;
    deleted_by?: number
    ;
}

// Optional properties, sequelize has the ability to fill these in itself
interface RolCreationAttributes extends Optional<RolAttributes,  "rol_id"> {}


export class Rol extends Model<RolAttributes, RolCreationAttributes> {
    declare rol_id: CreationOptional<number>;
    declare rol: string;
    declare created_at: CreationOptional<Date>;
    declare created_by: number;
    declare updated_at: CreationOptional<Date>;
    declare updated_by: number;
    declare deleted_at: CreationOptional<Date>;
    declare deleted_by: number;


    public get Rol(): NonAttribute<string> {
        return this.rol;
    }

    //sequelize associations

    public readonly users?: NonAttribute<User[]>; 

    public getUsers!: BelongsToManyGetAssociationsMixin<User>; // Note the null assertions!
    public addUser!: BelongsToManyAddAssociationMixin<User, number>;
    public createUsers!: BelongsToManyCreateAssociationMixin<User>;
    public setUsers!: BelongsToManySetAssociationsMixin<User, number>;
    public deleteUser!: BelongsToManyRemoveAssociationMixin<User, number>;
    public deleteUsers!: BelongsToManyRemoveAssociationsMixin<User, number>;

    public hasUser!: BelongsToManyHasAssociationMixin<User, number>;
    public countUsers!: BelongsToManyCountAssociationsMixin;

    public static associations: {
        users: BelongsToMany<Rol, User>;
    };
}

export type RolSequelizeEntity = typeof Rol;

export default (sequelize: Sequelize): RolSequelizeEntity => {
    const Model: RolSequelizeEntity = Rol.init(
        {
            rol_id: {
                type: DataTypes.INTEGER,
                defaultValue: DataTypes.INTEGER,
                primaryKey: true
            },
            rol: {
                type: DataTypes.INTEGER,
                defaultValue: DataTypes.INTEGER,
                allowNull: false
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
            created_by: DataTypes.INTEGER.UNSIGNED,
            updated_by: DataTypes.INTEGER.UNSIGNED,
            deleted_by: DataTypes.INTEGER.UNSIGNED
        }, {
            sequelize: sequelize,
            tableName: 'tbl_roles',
            paranoid: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at',
            deletedAt: 'deleted_at'
        }
    );
    return Model;
}
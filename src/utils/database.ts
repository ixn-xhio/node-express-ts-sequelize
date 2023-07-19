import config from 'config';
import { Sequelize } from "sequelize";

export class ConnectionProvider {
  private dbConfig: ConfigDatabase = config.get('DATABASE');
  private host = this.dbConfig.MYSQL_HOST;
  private database = '';
  private user = '';
  private password = '';

  constructor() {
    if(process.env.NODE_ENV !== 'test') {
      this.database = this.dbConfig.MYSQL_DATABASE;
      this.user = this.dbConfig.MYSQL_USER;
      this.password = this.dbConfig.MYSQL_PASSWORD;
    }
  }

  getConnection(){
    const sequelize = new Sequelize(this.database, this.user, this.password, {
      host: this.host,
      dialect: 'mysql'
    })
    return sequelize;
  }
}


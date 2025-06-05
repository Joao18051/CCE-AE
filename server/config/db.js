const { Sequelize } = require('sequelize');
const config = require('./appConfig');

class Database {
  constructor() {
    //Singleton
    if (Database.instance) {
      return Database.instance;
    }

    this.sequelize = new Sequelize({
      dialect: config.database.dialect,
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      dialectOptions: {
        options: {
          ...config.database.options,
          enableArithAbort: true
        }
      },
      logging: config.database.logging
    });

    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getSequelize() {
    return this.sequelize;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
      console.error('Não foi possível conectar ao banco de dados:', error);
      throw error;
    }
  }

  async dropAllForeignKeys() {
    const getFKsQuery = `
      SELECT 
        OBJECT_NAME(f.parent_object_id) AS TableName,
        f.name AS ForeignKeyName
      FROM sys.foreign_keys AS f
      WHERE f.type = 'F'
    `;

    const fks = await this.sequelize.query(getFKsQuery, { type: this.sequelize.QueryTypes.SELECT });
    
    for (const fk of fks) {
      await this.sequelize.query(`ALTER TABLE [${fk.TableName}] DROP CONSTRAINT [${fk.ForeignKeyName}]`);
    }
  }

  async dropAllTables() {
    const getTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_type = 'BASE TABLE' 
      AND table_catalog = '${this.sequelize.config.database}'
    `;

    const tables = await this.sequelize.query(getTablesQuery, { type: this.sequelize.QueryTypes.SELECT });
    
    for (const table of tables) {
      await this.sequelize.query(`DROP TABLE [${table.table_name}]`);
    }
  }

  async sync(options = {}) {
    try {
      if (options.force) {
        console.log('Iniciando reset do banco de dados...');
        
        console.log('Removendo foreign keys...');
        await this.dropAllForeignKeys();
        
        console.log('Removendo tabelas...');
        await this.dropAllTables();
        
        console.log('Recriando tabelas...');
        await this.sequelize.sync({ force: false });
        
        console.log('Reset do banco de dados concluído.');
      } else {
        await this.sequelize.sync(options);
      }

      console.log('Modelos sincronizados com o banco de dados.');
    } catch (error) {
      console.error('Erro ao sincronizar modelos:', error);
      throw error;
    }
  }

  async close() {
    try {
      await this.sequelize.close();
      console.log('Conexão com o banco de dados fechada.');
    } catch (error) {
      console.error('Erro ao fechar conexão:', error);
      throw error;
    }
  }
}

const instance = Database.getInstance();

module.exports = {
  Database,
  sequelize: instance.getSequelize()
};
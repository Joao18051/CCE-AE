require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  
  //Database
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dialect: 'mssql',
    options: {
      encrypt: true,
      trustServerCertificate: true
    },
    logging: process.env.DB_LOGGING === 'true'
  },

  //Hash
  auth: {
    bcrypt: {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10
    }
  },

  //JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },

  //API
  api: {
    prefix: '/api',
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
      optionsSuccessStatus: 200
    }
  }
};

module.exports = config; 
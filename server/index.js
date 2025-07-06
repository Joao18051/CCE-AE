require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config/appConfig')
const authRoutes = require('./routes/authRoutes')
const { Database } = require('./config/db')
const { errorHandler } = require('./middleware/errorHandler')
const AppError = require('./utils/AppError')
const chatbotRoutes = require('./routes/chatbotRoutes')

// Import models to ensure they are registered
require('./models');

const app = express()

// Database initialization
const initializeDatabase = async () => {
  const db = Database.getInstance();
  try {
    await db.connect();
    // Force sync in development mode to recreate tables
    await db.sync({ force: config.env === 'development' });
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Erro na inicialização do banco de dados:', error);
    process.exit(1);
  }
};

// Express configuration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// CORS configuration
app.use(cors(config.api.cors))

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/chatbot', chatbotRoutes)

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Não foi possível encontrar ${req.originalUrl} neste servidor!`, 404));
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(config.port, () => {
      console.log(`Servidor rodando na porta ${config.port} em modo ${config.env}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await Database.getInstance().close();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao encerrar servidor:', error);
    process.exit(1);
  }
});

startServer();
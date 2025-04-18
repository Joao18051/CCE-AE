const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/router')
const sequelize = require('./config/db')

const app = express()

// Sincronização com o banco de dados
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true })
    console.log('Banco de dados sincronizado com sucesso!')
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error)
  }
}

// Configurações do Express
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use("/", router)

// Iniciar servidor
const port = 4000
const startServer = async () => {
  await syncDatabase()
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
  })
}

startServer()
require('dotenv')
  .config()
const app = require('./app')
const db = require('./db')

process.on('uncaughtException', err => {
  console.error(`${err.name}: ${err.message}
Shutting down due to an error...`)
  process.exit(1)
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})

process.on('unhandledRejection', err => {
  console.error(`${err.name}: ${err.message}
Shutting down due to an error...`)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...')
  server.close(() => {
    console.log('Process terminated!')
  })
})

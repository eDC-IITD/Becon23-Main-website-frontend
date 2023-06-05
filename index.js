require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())

app.use(express.static("client"));

const registrationRouter = require('./routes/registration')
app.use('/api/registration', registrationRouter)

const loginRouter = require('./routes/login')
app.use('/api/login', loginRouter)

const eventRouter = require('./routes/event')
app.use('/api/event', eventRouter)

const messageRouter = require('./routes/message')
app.use('/api/message', messageRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
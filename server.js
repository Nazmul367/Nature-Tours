const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

// console.log(process.env)

// Atlas connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    // .connect(process.env.DATABASE_LOCAL, {
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(con => {
        // console.log(con.connections)
        console.log('DB conncection successful!')
    })

// Mongoose Schema
const tourSchema = new mongoose.Schema({
    // name: String,
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
})

// Mongoose Model
const Tour = mongoose.model('Tour', tourSchema)

// Test data
const testTour = new Tour({
    name: "Test Tour 2",
    price: 997
})

testTour
    .save()
    .then(doc => {
        console.log(doc)
    }).catch(err => {
        console.log(`Error : `, err)
    })

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running .. ${port}`)
})
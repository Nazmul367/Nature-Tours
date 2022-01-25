const mongoose = require('mongoose')
const fs = require('fs')

const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
dotenv.config({ path: './config.env' })

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

// Data import from json file
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data import successful')
    } catch (err) {
        console.log(`data import error : `, err)
    }
    process.exit()
}

// Delete all data
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('Data delete successful')
    } catch (err) {
        console.log(`data delete error`, err)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}

// console.log(process.argv)

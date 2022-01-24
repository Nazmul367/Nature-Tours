const express = require("express");
const morgan = require("morgan");

// Routes
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// Middleware
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

app.use(express.json());

// Static file access
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString()
	console.log(req.requestTime)
	next()
})

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app

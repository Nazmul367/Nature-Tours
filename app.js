const express = require("express");
const morgan = require("morgan");

const AppError = require('./utils/appError')
const globalErroHandler = require('./controllers/errorController')

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
	console.log(req.headers)
	next()
})

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Undefine routes handle Middleware
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))

	// res.status(404).json({
	// 	status: 'fail',
	// 	message: `Can't find ${req.originalUrl} on this server`
	// })

	// const err = new Error(`Can't find ${req.originalUrl} on this server`)
	// err.status = 'fail'
	// err.statusCode = 404

	// next(err)
})

// Error handle Middleware
app.use(globalErroHandler)

module.exports = app

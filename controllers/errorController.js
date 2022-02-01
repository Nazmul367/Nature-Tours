const AppError = require('../utils/appError')

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path} : ${err.value}`

	return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
	console.log(`value : `, value)

	const message = `Duplicate field value : ${value}. Please use another value`

	return new AppError(message, 400)
}

// Wrong token
const handleJWTError = () => new AppError('Invalid token. Please log in again', 401)

// Token expire
const handleJWTExpiredError = () => new AppError('Invalid token. Please log in again', 401)

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	})
}

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		})

		//Programing error - don't leak details 
	} else {
		console.error(`Error : `, err)

		res.status(500).json({
			status: 'error',
			message: 'Something went wrong'
		})
	}
}

module.exports = (err, req, res, next) => {

	err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res)
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err }

		if (error.name === 'CastError') error = handleCastErrorDB(error)
		if (error.code === 11000) error = handleDuplicateFieldsDB(error)

		// auth
		if (error.name === 'JsonWebTokenError') error = handleJWTError()
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

		sendErrorProd(error, res)
	}

	// next()
}
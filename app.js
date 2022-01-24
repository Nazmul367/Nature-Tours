const express = require("express");
const fs = require('fs');
const morgan = require("morgan");

const app = express()

// Middleware
app.use(express.json());
app.use(morgan('dev'))

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString()
	console.log(req.requestTime)
	next()
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// Get All Tours
const getAllTours = (req, res) => {
	res.status(200).json({
		status: "success",
		requestTime: req.requestTime,
		results: tours.length,
		data: {
			tours
		}
	})
}

// Get Tour
const getTour = (req, res) => {
	// console.log(req.params)

	const id = req.params.id * 1
	const tour = tours.find(tour => tour.id === id)

	// if (id > tours.length) {
	if (!tour) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID"
		})
	}

	res.status(200).json({
		status: "success",
		data: {
			tour
		}
	})
}

// Create New Tour
const createTour = (req, res) => {
	// console.log(req.body)

	const newTourId = tours[tours.length - 1].id + 1
	const newTour = Object.assign({ id: newTourId }, req.body)

	tours.push(newTour)

	fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
		res.status(201).json({
			status: "success",
			data: {
				tour: newTour
			}
		})
	})
}

// Update Tour
const updateTour = (req, res) => {
	if (req.params.id * 1 > tours.length) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID"
		})
	}

	res.status(200).json({
		status: "success",
		data: {
			tour: "Update tour here..."
		}
	})
}

// Delete Tour
const deleteTour = (req, res) => {
	if (req.params.id * 1 > tours.length) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID"
		})
	}

	res.status(200).json({
		status: "success",
		data: null
	})
}

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

const getAllUsers = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route isn't define"
	})
}

const getUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route isn't define"
	})
}

const createUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route isn't define"
	})
}

const updateUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route isn't define"
	})
}

const deleteUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route isn't define"
	})
}

app.route('/api/v1/tours').get(getAllTours).post(createTour)
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

app.route('/api/v1/users').get(getAllUsers).post(createUser)
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

const port = 3000;

app.listen(port, () => {
	console.log(`Server running .. ${port}`)
})

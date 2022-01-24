const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// Tour id not exist
exports.checkID = (req, res, next, val) => {
    console.log(`Tour id ${val}`)

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }
    next()
}

// Tour name or price exist
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "fail",
            message: "Missing tour name or price"
        })
    }
    next()
}

// Get All Tours
exports.getAllTours = (req, res) => {
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
exports.getTour = (req, res) => {
    // console.log(req.params)

    const id = req.params.id * 1
    const tour = tours.find(tour => tour.id === id)

    // if (id > tours.length) {
    // if (!tour) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid ID"
    //     })
    // }

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
}

// Create New Tour
exports.createTour = (req, res) => {
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
exports.updateTour = (req, res) => {
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid ID"
    //     })
    // }

    res.status(200).json({
        status: "success",
        data: {
            tour: "Update tour here..."
        }
    })
}

// Delete Tour
exports.deleteTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: null
    })
}
// const fs = require('fs');
const Tour = require('../models/tourModel')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// Tour id not exist
// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id ${val}`)

//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid ID"
//         })
//     }
//     next()
// }

// Tour name or price exist
// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Missing tour name or price"
//         })
//     }
//     next()
// }

// Get All Tours
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find()

        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

// Get Tour
exports.getTour = async (req, res) => {
    // console.log(req.params)

    try {
        const tour = await Tour.findById(req.params.id)
        // await Tour.findOne({_id: 'id'})

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: "Didn't find the ID"
        })
    }

    // const id = req.params.id * 1
    // const tour = tours.find(tour => tour.id === id)

    // if (id > tours.length) {
    // if (!tour) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid ID"
    //     })
    // }
}

// Create New Tour
exports.createTour = async (req, res) => {
    console.log(`req.body : `, req.body)

    try {
        // const newTour = new Tour({})
        // newTour.save()

        const newTour = await Tour.create(req.body)

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: "Invalid data sent!"
        })
    }

    // const newTourId = tours[tours.length - 1].id + 1
    // const newTour = Object.assign({ id: newTourId }, req.body)

    // tours.push(newTour)

    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status: "success",
    //         data: {
    //             tour: newTour
    //         }
    //     })
    // })
}

// Update Tour
exports.updateTour = async (req, res) => {
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid ID"
    //     })
    // }

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

// Delete Tour
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}
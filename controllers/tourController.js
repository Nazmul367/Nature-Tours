// const fs = require('fs');
const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

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

exports.alaisTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price' // rating try hoile price sort hobe
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'

    next()
}


// Get All Tours
exports.getAllTours = async (req, res) => {
    try {
        console.log(`req.query : `, req.query)

        // Build query
        // const queryObj = { ...req.query }
        // const excludedFields = ['page', 'sort', 'limit', 'fields']
        // excludedFields.forEach(el => delete queryObj[el])

        // // Advance filtering
        // let queryStr = JSON.stringify(queryObj)
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // // console.log(JSON.parse(queryStr))

        // let query = Tour.find(JSON.parse(queryStr))

        // Sorting - single
        // if (req.query.sort) {
        //     query = query.sort(req.query.sort)
        // }

        // Sorting - multiple
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     // console.log(sortBy)

        //     query = query.sort(sortBy)
        // } else {
        //     query = query.sort('-createdAt')
        // }

        // Field limiting
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ')
        //     // console.log(fields)

        //     query = query.select(fields)
        // } else {
        //     query = query.select('-__v')
        // }

        // Pagination
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 100
        // const skip = (page - 1) * limit

        // query = query.skip(skip).limit(limit)

        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments()
        //     if (skip >= numTours) throw new Error('This page does not exist')
        // }

        // const query = Tour.find(queryObj)
        // const tours = await Tour.find(queryObj)
        // const tours = await Tour.find(req.query)

        // const tours = await Tour.find()
        //     .where('duration').equals(5)
        //     .where('difficulty').equals('easy')

        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // })

        // Execute query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        const tours = await features.query

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

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    // _id: null,
                    _id: { $toUpper: '$difficulty' },
                    // _id: '$ratingsAverage',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },

            {
                $sort: { avgPrice: 1 }
            },

            // {
            //     $match: { _id: { $ne: "EASY" } }
            // }
        ])

        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        })

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ])

        res.status(200).json({
            status: "success",
            data: {
                plan
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}
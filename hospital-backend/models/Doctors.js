const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    work: {
        type: String,
        required: true,
    },
    expert: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            public_id: {
                type: String,
                // required: true,
            },
            url: {
                type: String,
                // required: true,
            },
        },
    ],
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
              user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                // required: true,
              },
            name: {
                type: String,
                // required: true,
            },
            rating: {
                type: Number,
                // required: true,
            },
            comment: {
                type: String,
                // required: true,
            },
        },
    ],
    fees: {
        type: Number,
        required: true
    },
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "User",
    //     required: true,
    //   },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Doctor", doctorSchema);
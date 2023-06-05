const mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    institute: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    howKnowAboutUs: {
        type: String,
        required: true,
    },
    referCode: {
        type: String,
    },
    eventsRegistered: [
        {
            eventName: {
                type: String
            }
        }
    ],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

module.exports = mongoose.model('Registration', registrationSchema)
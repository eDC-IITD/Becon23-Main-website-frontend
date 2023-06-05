const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    longName:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    desc: {
        type: String
    },
    mode: {
        type: String,
    },
    date: {
        type: String,
    },
    eventTimeline: {
        type: String
    },
    location:{
        type:String
    },
    registrationOpen: {
        type: Boolean,
        default: false
    },
    day:{
        type:String
    },
    externalRegistrationLink:{
        type:String,
        default:'No'
    },
    studentsRegistered: [
        {
            studentName: {
                type: String
            },
            studentEmail: {
                type: String
            },
            isScanned:{
                type:Boolean,
                default:false
            }
        }
    ],
})

module.exports = mongoose.model('Event', eventSchema)
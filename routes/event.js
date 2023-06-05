const express = require('express');
const router = express.Router();
const Event = require("../models/event");
const Registration = require("../models/registration");

//Get
router.get('/', async (req, res) => {
    try {
        const event = await Event.find();
        res.status(200).json({
            status: 200,
            length: event.length,
            event: event
        })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//Get
router.get('/day/:day', async (req, res) => {
    try {
        const event = await Event.find({ day: req.params.day }).sort({"date": 1});
        for(var i=0;i<event.length;i++){
            event[i].studentsRegistered=[];
        }
        res.status(200).json({
            status: 200,
            length: event.length,
            event: event
        })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//Get
router.get('/eventDetail/:eventName', async (req, res) => {
    try {
        const eventNameToSearch = req.params.eventName;
        const event = await Event.findOne({ eventName: eventNameToSearch });
        res.status(200).json({
            status: 200,
            noOfRegistration: event.studentsRegistered.length,
            event: event
        })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//Post
router.post('/', async (req, res) => {
    const event = new Event({
        eventName: req.body.eventName,
        longName: req.body.longName,
        desc: req.body.desc,
        mode: req.body.mode,
        date: req.body.date,
        eventTimeline: req.body.eventTimeline,
        location: req.body.location,
        day: req.body.day,
        image: req.body.image,
        externalRegistrationLink: req.body.externalRegistrationLink
    })
    try {
        const newEvent = await event.save()
        res.status(201).json({
            status: 201,
            event: newEvent
        })
    }
    catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        })
    }
})

//PUT
router.put('/register', async (req, res) => {
    try {
        var studentRegistedForEvent = false;

        const studentDetails = await Registration.findOne({ email: req.body.studentEmail });
        const eventsRegistered = studentDetails.eventsRegistered;
        for (var i = 0; i < eventsRegistered.length; i++) {
            if (eventsRegistered[i].eventName === req.body.eventName) {
                studentRegistedForEvent = true;
                break;
            }
        }

        const event = await Event.findOne({ eventName: req.body.eventName })
        const isRegistrationOpen = event.registrationOpen;

        if (studentRegistedForEvent) {
            res.status(400).json({
                status: 400,
                message: "Already registered for event",
            })
        }
        else if (isRegistrationOpen === false) {
            res.status(400).json({
                status: 400,
                message: `Registertion is closed for ${req.body.eventName}`,
            })
        }
        else {
            const updatedStudent = await Registration.findOneAndUpdate({ email: req.body.studentEmail }, {
                $push: {
                    eventsRegistered: {
                        eventName: req.body.eventName
                    }
                }
            }, { 'new': true })

            const updatedEvent = await Event.findOneAndUpdate({ eventName: req.body.eventName }, {
                $push: {
                    studentsRegistered: {
                        studentName: req.body.studentName,
                        studentEmail: req.body.studentEmail,
                    }
                }
            }, { 'new': true })

            res.status(200).json({
                status: 200,
                message: `Successfully registered for ${req.body.eventName}`
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        })
    }
})

//PUT
router.put('/qrScan', async (req, res) => {
    try {
        const event = await Event.findOne({ eventName: req.body.eventName })
        if(event===null){
            res.status(400).json({
                status: 400,
                message: "No event found with this eventName"
            })
        }
        else{
            const allStudentsRegistered=event.studentsRegistered;
            const studentRegisteredArray=allStudentsRegistered.filter(obj=> obj.studentEmail === req.body.studentEmail);
            if (studentRegisteredArray.length === 0) {
                res.status(400).json({
                    status: 400,
                    message: "Student is not registered for event"
                })
            }
            else {
                const studentRegistered=studentRegisteredArray[0];
                if (studentRegistered.isScanned == true) {
                    res.status(400).json({
                        status: 400,
                        message: "QR code is already scanned",
                    })
                }
                else {
                    const updatedEvent = await Event.findOneAndUpdate(
                        { eventName: req.body.eventName, "studentsRegistered.studentEmail": req.body.studentEmail },
                        { $set: { "studentsRegistered.$.isScanned": true } },
                        { 'new': true }
                    )
                    res.status(200).json({
                        status: 200,
                        message: "QR code scanned successfully",
                        studentDetails:studentRegistered
                    })
                }
            }
        }
    }
    catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        })
    }
})

module.exports = router
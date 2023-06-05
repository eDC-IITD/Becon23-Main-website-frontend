const express = require('express')
const router = express.Router()
const Registration = require("../models/registration")

//Password
const generator = require('generate-password');
const bcrypt = require('bcrypt');

// Confirmation mail
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
    host: 'email-smtp.ap-south-1.amazonaws.com',
    port:465,
    auth: {
        user: 'AKIAZJ2NPFB7G5TKIDNR',
        pass: 'BJcAh3Yfhc06dt1k18tNTIAYbWraXxnD9OYzjmEeAqYE'
    }
}));

//Get
router.get('/', async (req, res) => {
    try {
        const registrations = await Registration.find()
        res.status(200).json(
            {
                status: 200,
                length: registrations.length,
                registration: registrations
            }
        )
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

// Get total no of registration
router.get('/length', async (req, res) => {
    try {
        const registrations = await Registration.find()
        res.status(200).json(
            {
                status: 200,
                length: registrations.length,
            }
        )
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//Get
router.get('/studentDetails/:studentEmail', async (req, res) => {
    try {
        const studentEmailToSearch = req.params.studentEmail;
        const registration = await Registration.findOne({ email: studentEmailToSearch });
        res.status(200).json(
            {
                status: 200,
                studentDetails: registration
            }
        )
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//POST
router.post('/', async (req, res) => {
    try {
        const checkUserAlreadyExist = await Registration.findOne({ email: req.body.email })
        if (checkUserAlreadyExist !== null) {
            res.status(400).json({
                status: 400,
                message: "Account already exist"
            })
        }
        else {
            const password = generator.generate({
                length: 6,
                numbers: true,
            });

            const hashPassword = bcrypt.hashSync(password, 12)

            const registration = new Registration({
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                mobile: req.body.mobile,
                institute: req.body.institute,
                city: req.body.city,
                state: req.body.state,
                howKnowAboutUs: req.body.howKnowAboutUs,
                referCode: req.body.referCode
            })

            const newRegistration = await registration.save()
            res.status(201).json(
                {
                    registration: newRegistration,
                    status: 201
                }
            )
            var mailOptions = {
                from: "becon2023.edciitd@gmail.com",
                to: newRegistration.email,
                subject: "Registration Successful for BECON'23 | eDC IITD",
                html: `
                    Dear ${newRegistration.name},<br>
                    <p>Thanks for registering for BECON'23  which is going to be held from January 6th to January 8th, 2023.</p>
        
                    <p>BECON IIT Delhi is India's largest entrepreneurial summit with a footfall of 50,000+ and extensive participation from 500+ institutes across India. We seek to bring together the world's leading business professionals, entrepreneurs, and change-makers and connect them to a broader audience of young students and leaders. eDC aims to further IITD's reputed entrepreneurship culture by imparting practical knowledge to students, helping them at every stage of their start-up journey.</p>
        
                    <p>Your credentials for logging into the BECON website are as follows:<br>
                    Email- ${newRegistration.email}<br>
                    Password- ${password}</p>
        
                    <p>Please join the following WhatsApp group and follow us on our social media handles to get the latest updates about our events and competitions.<br>
                    WhatsApp- https://chat.whatsapp.com/EHOg4e6tdtNCdeuWOlWvB3</p>
        
                    <p>Instagram- https://www.instagram.com/edc_iitd/ <br>
                    LinkedIn-https://www.linkedin.com/company/edc-iit-delhi/mycompany/<p>
        
                    <p>Please feel free to contact us in case of any queries.<p>
        
                    <p>Regards,<br>
                    eDC Tech Team,<br>
                    BECON'23<p>
               `
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

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
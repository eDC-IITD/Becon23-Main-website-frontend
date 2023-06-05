const express = require('express');
const router = express.Router();
const Student = require("../models/registration");

// Forgat password
const generator = require('generate-password');
const bcrypt = require('bcrypt');

// Forgat password mail mail
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

//POST
router.post('/', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        Student.findOne({ email: email }, (error, foundResult) => {
            if (!foundResult) {
                res.status(401).json({
                    status: 401,
                    message: "Account does not exist"
                })
            }
            else {
                if (bcrypt.compareSync(password, foundResult.password)) {
                    res.status(200).json({
                        status: 200,
                        studentDetails: foundResult
                    })
                }
                else {
                    res.status(401).json({
                        status: 401,
                        message: "Incorrect Password"
                    })
                }
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        })
    }
})

//POST
router.put('/forgotPassword', async (req, res) => {
    try {
        const email = req.body.email;

        const password = generator.generate({
            length: 6,
            numbers: true,
        });
        const hashPassword = bcrypt.hashSync(password, 12)

        Student.findOneAndUpdate({ email: email }, {
            $set: {
                "password": hashPassword
            }
        }, (error, foundResult) => {
            if (!foundResult) {
                res.status(401).json({
                    status: 401,
                    message: "Account does not exist"
                })
            }
            else {
                res.status(200).json(
                    {
                        status: 200,
                        message: "Password updated Successfully"
                    }
                )
                var mailOptions = {
                    from: "becon2023.edciitd@gmail.com",
                    to: foundResult.email,
                    subject: "Password updated successful for BECON'23 | eDC IITD",
                    html: `
                        Dear ${foundResult.name},<br>
            
                        <p>BECON IIT Delhi is India's largest entrepreneurial summit with a footfall of 50,000+ and extensive participation from 500+ institutes across India. We seek to bring together the world's leading business professionals, entrepreneurs, and change-makers and connect them to a broader audience of young students and leaders. eDC aims to further IITD's reputed entrepreneurship culture by imparting practical knowledge to students, helping them at every stage of their start-up journey.</p>
            
                        <p>Your updated credentials for logging into the BECON website are as follows:<br>
                        Email- ${foundResult.email}<br>
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
        })
    }
    catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        })
    }
})

module.exports = router
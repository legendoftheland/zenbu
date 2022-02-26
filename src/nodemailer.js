var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zenbudiscordbot@gmail.com',
        pass:  `${process.env.EMAIL_PASS}`
    }
    });

module.exports = transporter;
'use strict';
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASSWORD // generated ethereal password
    }
});

module.exports = {

    sendFeedbackMail: function(feedbackText) {
        let mailOptions = {
            from: 'EU Bot Feedback', // sender address
            to: process.env.MAIL_FEEDBACKTO, // list of receivers
            subject: 'EU BOT Feedback', // Subject line
            text: "Hello there, \n this is the EU Bot. A user sent you the following text: '\n" + feedbackText + "\n'. Have a nice day! \n Yours EU Bot.", // plain text body
            //html: '<b>Hello world?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId, feedbackText);
        });
    }
}

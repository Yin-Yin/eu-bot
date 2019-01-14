'use strict';
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
 service: process.env.MAIL_SERVICE,
 auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

module.exports = {

    sendFeedbackMail: function(feedbackText) {
        let mailOptions = {
            from: 'EU Bot Feedback', // sender address
            to: process.env.MAIL_FEEDBACKTO, // list of receivers
            subject: 'EU BOT Feedback', // Subject line
            text: "Hello there, \n this is the EU Bot. A user sent you the following text: '\n" + feedbackText + "\n' Have a nice day! \n Yours EU Bot.", // plain text body
            html: '<h1>EU Bot Feedback Message</h1><p>Hello there,</p><p>this is the EU Bot. A user sent you the following text: </p><p>' + feedbackText + '</p><p>Have a nice day! \n Yours EU Bot.</p>' // html body
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

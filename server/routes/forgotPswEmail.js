var express = require('express');
var router = express.Router();

var sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

router.get('/', (req, res, next) => {
  const {to, pswResetCode} = req.query;

  const msg = {
    to : to,
    from: "vasu.sharma@stonybrook.edu",
    subject: "GoLogoLo Password Reset Code",
    text: "Hello User, \nYour Password Reset Code is: " + pswResetCode,
  }
  sgMail.send(msg);

})

module.exports = router;
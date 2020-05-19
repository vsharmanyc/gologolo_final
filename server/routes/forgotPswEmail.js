var express = require('express');
var router = express.Router();

var sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

router.get('/', (req, res, next) => {
  const {to, from, subject, text} = req.query;

  const msg = {
    to : to,
    from: from,
    subject: subject,
    text: text
  }
  sgMail.send(msg);

})

module.exports = router;
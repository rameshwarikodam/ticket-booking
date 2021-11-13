const db = require('../models');
const config = require('../config/auth.config');
const email = require('../utils/email');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Send Email to agents for creating agent account
exports.createAgent = (req, res) => {
    let data = req.body;
    email.shoot({
        emailTo: data.emailTo,
        // emailCC: data.emailCC,
        subject: data.subject,
        bodyTemplate: 'HHHHHHHHHHHHqqqqqqqqqqqqq'
    })
    .then(response => {
        if (response) {
            res.status(200).send({
                response
            });
        } else {
            res.status(404).send({ message: "Cannot send mail." });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
}

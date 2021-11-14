const db = require('../models');
const config = require('../config/auth.config');
const email = require('../utils/email');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const signIn = require("./auth.controller");

// Send Email to agents for creating agent account
exports.informToAgent = (req, res) => {
    let data = req.body;
    let userData;
    // Save User to Database
  User.create({
    // username: req.body.username,
    email: data.email,
    password: bcrypt.hashSync(data.password, 8)
  })
    .then(user => {
        // when roles not provided role = 1 
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
        //to send token to agent
        userData = signIn.signin(data);
        console.log('userData', userData);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

    email.shoot({
        emailTo: data.emailTo,
        // emailCC: data.emailCC,
        subject: data.subject,
        text: `Click the Following link to to verify your user account..\n\n\t http://0.0.0.0:8080/api/user-details`
        // userData.accessToken
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

exports.createAgent = async(req, res) => {
    let data = req.body;
    let token = req.params.token;
    console.log('token', token);
    if(token) {
        var decode = jwt.decode(token, config.secret);
    } else {
        return res.send({
          status: false,
          message: "Invalid token"
        });
    }
    console.log("token decode::", decode);
    await db.Userdetail.create({
        dob: data.dob,
        address: data.address,
        phone_number: data.phone_number,
        userID: decode.userID,
        isRegistered: true
    })
    .then((details) => {
        if(!details) {
            return res.status(404).send({ message: "Agent Details not added." });
        }
        res.status(200).send({
            message: "User details added successfully"
          });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
      });
}

const db = require('../models');
const config = require('../config/auth.config');
const email = require('../utils/email');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const signIn = require("./auth.controller");

// Send Email to agents for creating agent account
exports.informToAgent = async(req, res) => {
    let data = req.body;
    let checkUser = await User.findOne({
      where: {
        email: data.email
      }
    })
    if(checkUser){
      return res.status(401).send({ message: "User already exists." });
    }
    User.create({
    email: data.email,
    password: bcrypt.hashSync(data.password, 8)
    })
    .then(user => {
      // set role as Agent
      user.setRoles([2]).then(async() => {
        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: config.jwtExpiration
        });
        let refreshToken = await RefreshToken.createToken(user);
        email.shoot({
          emailTo: data.email,
          // emailCC: data.emailCC,
          subject: data.subject,
          text: `Click the Following link to to verify your user account..\n\n\t http://0.0.0.0:8080/api/user-details`
          // userData.accessToken
      })
      .then(response => {
        if (response) {
          res.status(200).send({
            userID: user.id,
            email: user.email,
            accessToken: token,
            refreshToken: refreshToken,
          });
        } else {
          res.status(404).send({ message: "Cannot send mail." });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
    });
  })
  .catch(err => {
    res.status(500).send({ message: err });
  });
}

exports.createAgent = async(req, res) => {
  let data = req.body;
  await User.findOne({
    where: {
      id: data.userID
    }
  })
  .then(async(findUser) => {
    await db.Userdetail.create({
      dob: data.dob,
      address: data.address,
      phone_number: data.phone_number,
      userID: findUser.id,
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
  })
  .catch(err =>{
    res.status(401).send({ message: "Agent not exist." });
  })    
}

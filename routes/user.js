const express = require("express");
const connection = require("../connection");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

/**
 * Endpoint for user registration
 * This API allows new user to sign up and be registered in the system
 * It first checks if the provided email already exists in the databse and if not the user is registered
 */
router.post("/signup", (req, res) => {
  const user = req.body;
  let query = "SELECT email, password, status, role FROM user WHERE email = ?";

  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "INSERT INTO user(name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')";
        connection.query(
          query,
          [user.name, user.contactNumber, user.email, user.password],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "Successfully registered" });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

/**
 * Endpoint for user login
 * this allows user to login to the system
 */
router.post("/login", (req, res) => {
  const user = req.body;
  query = "SELECT email, password, role, status FROM user WHERE email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res.status(401).json({
          message: "Incorrect username or password",
        });
      } else if (results[0].status === "false") {
        return res.status(401).json({
          message: "Wait for admin approval",
        });
      } else if (results[0].password == user.password) {
        const response = {
          name: results[0].name,
          email: results[0].email,
          role: results[0].role,
        };

        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        return res.status(200).json({ token: accessToken });
      } else {
        res
          .status(400)
          .json({ message: "Something went wrong, please tyr again later!" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
/**
 * Endpoint for resetting Password
 */
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/forgotPassword", (req, res) => {
  const user = req.body;
  query = "SELECT email, password FROM user WHERE email = ?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .status(200)
          .json({ message: "Password sent successfully to your email." });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Password sent successfully to your email",
          html: `<p><b>Your login details for cafe Management System</b></br><b>Email: </b> ${results[0].email}</p></br><p><b>Password: ${results[0].password}</b></br><a href="http://localhost:4200/user/login">Click hrere to Login</a></p>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent successfully: ${info.response}`);
          }
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;

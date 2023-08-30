const express = require("express");
const connection = require("../connection");

const router = express.Router();

// creating a new user

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

module.exports = router;

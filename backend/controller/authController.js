const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authenticate = (req, res, next) => {
  User.findOne({ userId: req.body.userId })
    .then((result) => {
      if (result) {
        const token = jwt.sign(
          {
            userId: result.userId,
          },
          "geomessenger-secret",
          {
            expiresIn: "2 days",
          }
        );
        res.status(200).json({
          user: result,
          status: "old",
          token: token,
        });
      } else {
        const createUser = new User({
          name: req.body.name,
          userId: req.body.userId,
          profilePicURL: req.body.profilePicURL,
          location: {
            type: "Point",
            coordinates: [0, 0],
          },
        });
        createUser
          .save()
          .then((user) => {
            const token = jwt.sign(
              {
                userId: user.userId,
              },
              "geomessenger-secret",
              {
                expiresIn: "2 days",
              }
            );
            res.json({
              user: user,
              token: token,
              status: "new",
            });
          })
          .catch((err) => {
            res.json({
              isValid: false,
              err: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        err: err,
        status: false,
      });
    });
};

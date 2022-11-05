const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const doctorAuthToken = async (req, res, next) => {
  //take the token from the header

  const token = req.header("x-auth-token");
  if (!token) {
    console.log("token not found");
    res.status(401).json({
      errors: [
        {
          msg: "token not found;/",
        },
      ],
    });
  } else {
    //authenticate token

    try {
      //verify using secret key
      const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (user.userType != "1") {
        return res(403).json({
          errors: [
            {
              msg: "forbidden access",
            },
          ],
        });
      }
      req.userID = user.userID ;
      next();
    } catch {
      res.status(403).json({
        errors: [
          {
            msg: "invalid token",
          },
        ],
      });
    }
  }
};
module.exports = doctorAuthToken;

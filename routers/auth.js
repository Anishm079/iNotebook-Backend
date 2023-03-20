const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "Anish$123";

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must be a atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res, next) => {
    //if there is an erro return the bad requests and the error
    // console.log(req.body);
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check whether user exist already with this email
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user)
        return res
          .status(400)
          .json({ success, message: "A user with the email already exist" });

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // .then(()=>{
      //     res.send(req.body)
      // }).catch(error=>{
      //     console.log(error);
      //     res.json({messge:"please enter a unique email value"});
      // })
      user = await User.findOne({ email: req.body.email });
      const data = {
        user: {
          id: user._id,
        },
      };
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authToken });
      // res.json({message:"A New User is Created"})
    } catch (err) {
      console.log(err.message);
      res.json({ success, message: "Error Occured" });
    }
  }
);

//Authenticate a user using '/api/auth/login',No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res, next) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, error: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ success, message: "Enter Valid Credentials" });

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare)
        return res
          .status(400)
          .json({ success, message: "Enter Valid Credentials" });

      const data = {
        user: {
          id: user._id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.log(err.message);
      res.json({ message: "Error Occured" });
    }
  }
);

router.post("/getuser", fetchuser, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId }).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.json({ message: "Error Occured" });
  }
});

module.exports = router;

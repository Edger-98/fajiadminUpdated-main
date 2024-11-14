const User = require("../models/auth_model");
const bcrypt = require("bcrypt");
const authValidationSchema = require("../validators/auth_validators");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { hashPassword, comparePassword } = require("../secure/hashPassword");

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    
    const user = await User.findById(id).select("username email role _id userId"); 

    if (user) {
      res.json({
        username: user.username,
        email: user.email,
        role: user.role,
        userId: user.userId,
        _id:user._id
        
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// *******************
// SIGN UP LOGIC
// *******************

exports.signUp = async (req, res) => {
  const { error } = authValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const {
    userId,
    phoneNo,
    username,
    email,
    password,
    role,
    pushNotificationsEnabled,
  } = req.body;
  try {
    // Check if user already exists
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await hashPassword(password);

    const userCreated = await User.create({
      userId,
      phoneNo,
      username,
      email,
      role,
      password: hashedPassword,
      pushNotificationsEnabled,
    });
    console.log(userCreated);
    const token = await userCreated.generateToken();
    if (!token) {
      return res.status(500).json({ message: "Failed to generate token" });
    }
    res.status(201).json({
      msg: userCreated,
      token,
      userId: userCreated._id.toString(),
    });
  } catch (err) {
    console.error("registration error:", err);
    res.status(500).json({ error: "Error ", details: err.message });
  }
};
// *******************
// SIGN IN LOGIC
// *******************
exports.signIn = async (req, res) => {
  // const { error } = schema.validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  try {
    // if (!email || !password) {
    //     return res.status(400).json({ message: 'All fields are required' });
    // }

    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await user.generateToken();
    if (!token) {
      return res.status(500).json({ message: "Failed to generate token" });
    }
    res.status(201).json({
      msg: "login successfull",
      token,
      userId: user._id.toString(),
      userRole: user.role,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
// Logout route to destroy session
exports.logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Replace 'connect.sid' with your session cookie name if different
    res.status(200).json({ message: "Logged out successfully" });
  });
};
// *******************
// Forget Password
// *******************

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const secret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ email }, secret, {
      expiresIn: "30d",
    });
    const link = `Click on this link to generate your new password/${process.env.CLIENT_URL}/reset-password/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mailOptions = {
      from: "admin123@gmail.com",
      to: email,
      subject: "Password Reset",
      text: link,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).send({
      message: "Password reset link send successfully on your gmail account",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Something went wrong", details: error.message });
  }
};

// *******************
// Reset Password
// *******************

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(password);
  try {
    if (!password) {
      return res.json({ status: "Please Provide password" });
    }
    const secret = process.env.JWT_SECRET_KEY;

    // Verify the token
    const verify = jwt.verify(token, secret);

    // Find the user by email
    const user = await User.findOne({ email: verify.email });
    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }
    console.log("User found:", user);

    // Hash the new password
    const newhashPassword = await hashPassword(password);

    user.password = newhashPassword;
    await user.save();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Something went wrong", details: error.message });
  }
};

// *******************
// Change Password
// *******************

exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "User not found please register" });
    }

    const isMatchPassword = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isMatchPassword) {
      return res
        .status(400)
        .send({ message: "Current password does not match" });
    }

    const newHashPassword = await hashPassword(newPassword);

    await User.updateOne({ email }, { password: newHashPassword });

    return res.status(200).send({ message: "Password change successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Something went wrong", details: error.message });
  }
};

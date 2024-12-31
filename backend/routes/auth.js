const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Signup
app.post("/api/auth/signup", (req, res) => {
  const { email, password, username } = req.body;

  // Read existing users
  const users = readJsonFile(usersFilePath);

  // Check if the email already exists
  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Generate a new user ID
  const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  // Create a new user
  const newUser = {
    id: newUserId,
    email,
    password,
    username,
  };

  users.push(newUser);
  writeJsonFile(usersFilePath, users);

  res.status(201).json({ message: "Signup successful!", id: newUserId });
});


// Login
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

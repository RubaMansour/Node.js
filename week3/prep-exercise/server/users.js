import newDatabase from "./database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = 'my-very-secret-key-1234567890!@#';

const isPersistent = true;
const database = newDatabase({ isPersistent });

// Register Endpoint
export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check if the username is already taken
    const existingUser = database.getById(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = database.create({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", id: newUser.id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login Endpoint
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    
    const user = database.getByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// Get Profile Endpoint
export const getProfile = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = database.getById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

// Logout Endpoint
export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Table from "./schema/Table.js"
import User from "./schema/User.js"
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/studyspot")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// add new table 
app.post("/tables", async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get all tables
app.get("/tables", async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// sign up new user 
app.post("/users/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// login user
app.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get one user
app.post("/users/getOne", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User found", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// user marks that they are at a table
app.post("/tables/iAmHere", async (req, res) => {
  try {
    const { tableId } = req.body;
    const table = await Table.findById(tableId);

    if (!table) return res.status(404).json({ error: "Table not found" });

    // Increase utilization by 1, but don't exceed capacity
    if (table.utilization < table.capacity) {
      table.utilization += 1;
    }

    await table.save();
    res.status(200).json({ message: "User marked as present", table });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

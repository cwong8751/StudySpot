import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,   // no duplicate usernames
    trim: true,     // removes extra spaces
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

export default mongoose.model("User", userSchema);

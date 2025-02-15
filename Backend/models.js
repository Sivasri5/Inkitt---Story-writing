import mongoose from "mongoose";

// ✅ **User Schema**
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  futureReads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", UserSchema);

// ✅ **Book Schema**
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  genre: { type: String, required: true },
  rating: { type: Number, default: 0 },
  comments: [{ type: String }],
});

const Book = mongoose.model("Book", BookSchema);


const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // ✅ Ensure `book` is required
  title: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model("Chapter", chapterSchema);


export { User, Book, Chapter };

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());

// 🔹 Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 🔹 User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// 🔹 Middleware to Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// ✅ **User Authentication**
// 🔸 Register Route
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Get Authenticated User Info (Profile)
app.get("/api/auth/user", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// 🔸 Login Route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.cookie("token", token, { httpOnly: true, secure: false });

  res.json({ message: "Login successful", user: { id: user._id, username: user.username }, token });
});

// 🔸 Logout Route
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});


const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });
  const Book = mongoose.model("Book", bookSchema);
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const books = await Book.find({ author: user._id });
      res.json({ username: user.username, books });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/books", async (req, res) => {
    try {
      const { title, genre, author } = req.body;
      const newBook = new Book({ title, genre, author });
      await newBook.save();
      res.status(201).json({ book: newBook });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/books", async (req, res) => {
    try {
      const books = await Book.find().populate("author", "username");
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/books/:bookId", async (req, res) => {
    try {
      await Book.findByIdAndDelete(req.params.bookId);
      res.json({ message: "Book deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
          

// 🔹 User Library Schema
const userLibrarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});
const UserLibrary = mongoose.model("UserLibrary", userLibrarySchema);

// 🔹 Add Book to User Library
app.post("/api/library/add", async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    let library = await UserLibrary.findOne({ userId });

    if (!library) {
      library = new UserLibrary({ userId, books: [] });
    }

    if (!library.books.includes(bookId)) {
      library.books.push(bookId);
      await library.save();
    }

    res.json({ message: "Book added to library", library });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get User Library
app.get("/api/library/:userId", async (req, res) => {
  try {
    const library = await UserLibrary.findOne({ userId: req.params.userId }).populate("books");
    res.json(library ? library.books : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Remove Book from Library
app.post("/api/library/remove", async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const library = await UserLibrary.findOne({ userId });

    if (library) {
      library.books = library.books.filter((id) => id.toString() !== bookId);
      await library.save();
    }

    res.json({ message: "Book removed from library" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  

// ✅ **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
// app.use(cookieParser());

// // 🔹 Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // 🔹 User Schema & Model
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // 🔹 Middleware to Verify JWT Token
// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ error: "Unauthorized" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });
//     req.user = decoded;
//     next();
//   });
// };

// // ✅ **User Authentication**
// // 🔸 Register Route
// app.post("/api/auth/register", async (req, res) => {
//   const { username, email, password } = req.body;
//   if (!username || !email || !password) return res.status(400).json({ error: "All fields are required" });

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: "Email already registered" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // 🔹 Get Authenticated User Info (Profile)
// app.get("/api/auth/user", async (req, res) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) return res.status(401).json({ message: "Unauthorized" });
  
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id).select("-password");
//       if (!user) return res.status(404).json({ message: "User not found" });
  
//       res.json(user);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  

// // 🔸 Login Route
// app.post("/api/auth/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) return res.status(400).json({ error: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ error: "Invalid password" });

//   const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

//   res.cookie("token", token, { httpOnly: true, secure: false });

//   res.json({ message: "Login successful", user: { id: user._id, username: user.username }, token });
// });

// // 🔸 Logout Route
// app.post("/api/auth/logout", (req, res) => {
//   res.clearCookie("token");
//   res.json({ message: "Logged out successfully" });
// });

// // 🔹 Book Schema & Model
// const bookSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     genre: { type: String, required: true },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   });
//   const Book = mongoose.model("Book", bookSchema);
  
//   // 🔹 Chapter Schema & Model
//   const chapterSchema = new mongoose.Schema({
//     book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//   });
//   const Chapter = mongoose.model("Chapter", chapterSchema);
  
//   // ✅ **Book Routes**
//   app.post("/api/books", async (req, res) => {
//     try {
//       const { title, genre, author } = req.body;
//       const newBook = new Book({ title, genre, author });
//       await newBook.save();
//       res.status(201).json({ book: newBook });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   });
  
//   app.get("/api/books", async (req, res) => {
//     try {
//       const books = await Book.find().populate("author", "username");
//       res.json(books);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   // ✅ **Chapter Routes**
//   app.post("/api/books/:bookId/chapters", async (req, res) => {
//     try {
//       const { title, content } = req.body;
//       const newChapter = new Chapter({ book: req.params.bookId, title, content });
//       await newChapter.save();
//       res.status(201).json({ chapter: newChapter });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   });
  
//   app.get("/api/books/:bookId/chapters", async (req, res) => {
//     try {
//       const chapters = await Chapter.find({ book: req.params.bookId });
//       res.json(chapters);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   app.get("/api/chapters/:chapterId", async (req, res) => {
//     try {
//       const chapter = await Chapter.findById(req.params.chapterId);
//       if (!chapter) return res.status(404).json({ message: "Chapter not found" });
//       res.json(chapter);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
// app.delete("/api/chapters/:chapterId", async (req, res) => {
//   try {
//     await Chapter.findByIdAndDelete(req.params.chapterId);
//     res.json({ message: "Chapter deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

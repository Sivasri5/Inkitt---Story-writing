import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Component/Home";
import Profile from "./Component/Profile";
import Author from "./Component/Author";
import Book from "./Component/Book";
import Chapter from "./Component/Chapter";
import Library from "./Component/Library";
import Login from "./Component/Login";
import Register from "./Component/Register";
import PrivateRoute from "./Component/PrivateRoute";
import NavBar from "./Component/NavBar";
import WriteStory from "./Component/Writestory";
import EditStory from "./Component/Editstory";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  return (
    <Router>
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/author/:id" element={<PrivateRoute element={<Author />} />} />
        <Route path="/book/:id" element={<PrivateRoute element={<Book />} />} />
        <Route path="/chapter/:bookId/:chapterId" element={<PrivateRoute element={<Chapter />} />} />
        <Route path="/library" element={<PrivateRoute element={<Library />} />} />
        <Route path="/write" element={<PrivateRoute element={<WriteStory />} />} />
        <Route path="/edit/:id" element={<PrivateRoute element={<EditStory />} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

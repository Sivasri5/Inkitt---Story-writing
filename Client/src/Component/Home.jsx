
// import { useEffect, useState } from "react";

// const Home = () => {
//   const [books, setBooks] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:5000/api/books")
//       .then((res) => res.json())
//       .then((data) => setBooks(data))
//       .catch((err) => console.error("Error fetching books:", err));
//   }, []);

//   const filteredBooks = books.filter((book) =>
//     book.title.toLowerCase().includes(search.toLowerCase()) &&
//     (filter === "" || book.genre === filter)
//   );

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Discover Books</h2>

//       <div className="flex space-x-2 mb-4">
//         <input
//           type="text"
//           className="border p-2 flex-1"
//           placeholder="Search books..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <select className="border p-2" value={filter} onChange={(e) => setFilter(e.target.value)}>
//           <option value="">All Genres</option>
//           <option value="Fantasy">Fantasy</option>
//           <option value="Sci-Fi">Sci-Fi</option>
//           <option value="Mystery">Mystery</option>
//         </select>
//       </div>

//       <ul>
//         {filteredBooks.map((book) => (
//           <li key={book._id} className="border p-2 rounded mb-2">
//             <h4 className="font-bold">{book.title}</h4>
//             <p className="text-gray-500">Genre: {book.genre}</p>
//             <p className="text-gray-500">by {book.author?.username}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Home;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Story Library</h2>
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book._id} className="border p-2 rounded mb-2">
              <h4 className="font-bold">{book.title}</h4>
              <p className="text-gray-500">{book.genre}</p>
              <Link to={`/book/${book._id}`} className="text-blue-500">Read Chapters</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};

export default Home;


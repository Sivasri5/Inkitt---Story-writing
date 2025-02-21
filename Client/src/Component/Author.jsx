import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Author = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchAuthorDetails();
  }, []);

  const fetchAuthorDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/authors/${id}`);
      const data = await res.json();
      setAuthor(data.author);
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching author details:", error);
    }
  };

  return (
    <div className="p-6">
      {author ? (
        <>
          <h1 className="text-3xl font-bold">{author.name}</h1>
          <p className="mt-2">{author.bio}</p>
          <h2 className="text-2xl font-semibold mt-4">Books by {author.name}</h2>
          <div className="grid grid-cols-3 gap-6 mt-4">
            {books.map((book) => (
              <Link key={book._id} to={`/book/${book._id}`} className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">{book.title}</h2>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p>Loading author details...</p>
      )}
    </div>
  );
};

export default Author;

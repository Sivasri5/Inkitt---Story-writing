import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) {
      setError("Invalid book ID");
      return;
    }

    fetch(`http://localhost:5000/api/books/${bookId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch book");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setError(null); // Clear any previous errors
      })
      .catch((err) => {
        console.error("Error fetching book:", err);
        setError("Book not found or server error.");
      });
  }, [bookId]);

  return (
    <div className="p-6">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : book ? (
        <>
          <h2 className="text-3xl font-bold">{book.title}</h2>
          <p className="text-gray-500">{book.genre}</p>

          <h3 className="mt-4 font-bold">Chapters</h3>
          {book.chapters && book.chapters.length > 0 ? (
            <ul>
              {book.chapters.map((chapter) => (
                <li key={chapter._id}>
                  <Link to={`/chapter/${chapter._id}`} className="text-blue-500">
                    {chapter.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No chapters yet.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Book;

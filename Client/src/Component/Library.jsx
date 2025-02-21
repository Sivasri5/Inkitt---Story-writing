import { useEffect, useState } from "react";

const Library = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));

    if (user) {
      fetch(`http://localhost:5000/api/library/${user._id}`)
        .then((res) => res.json())
        .then((data) => setLibrary(data))
        .catch((err) => console.error("Error fetching library:", err));
    }
  }, [user]);

  const isInLibrary = (bookId) => library.some((b) => b._id === bookId);

  const handleAddToLibrary = async (bookId) => {
    if (!user || !user._id) {
      console.error("User not logged in!");
      return;
    }
  
    await fetch("http://localhost:5000/api/library/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, bookId }),
    });
  
    setLibrary([...library, books.find((book) => book._id === bookId)]);
  };
  

  const handleRemoveFromLibrary = async (bookId) => {
    await fetch("http://localhost:5000/api/library/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, bookId }),
    });

    setLibrary(library.filter((b) => b._id !== bookId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Library</h2>

      <h3 className="font-bold mt-4">Your Library</h3>
      {library.length > 0 ? (
        <ul>
          {library.map((book) => (
            <li key={book._id} className="border p-2 rounded mb-2 flex justify-between">
              <div>
                <h4 className="font-bold">{book.title}</h4>
                <p className="text-gray-500">{book.genre}</p>
              </div>
              <button className="bg-red-500 text-white p-2 rounded" onClick={() => handleRemoveFromLibrary(book._id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books in your library yet.</p>
      )}

      <h3 className="font-bold mt-6">All Books</h3>
      <ul>
        {books.map((book) => (
          <li key={book._id} className="border p-2 rounded mb-2 flex justify-between">
            <div>
              <h4 className="font-bold">{book.title}</h4>
              <p className="text-gray-500">{book.genre}</p>
            </div>
            {isInLibrary(book._id) ? (
              <button className="bg-red-500 text-white p-2 rounded" onClick={() => handleRemoveFromLibrary(book._id)}>
                Remove
              </button>
            ) : (
              <button className="bg-blue-500 text-white p-2 rounded" onClick={() => handleAddToLibrary(book._id)}>
                Add to Library
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Library;

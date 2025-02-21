import { useEffect, useState } from "react";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        fetch(`http://localhost:5000/api/profile/${data._id}`)
          .then((res) => res.json())
          .then((profileData) => setBooks(profileData.books));
      })
      .catch((err) => console.error(err));
  }, []);

  // Create a new book
  const handleCreateBook = async () => {
    if (!profile) return;

    const res = await fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, genre, author: profile._id }),
    });

    const data = await res.json();
    if (res.ok) {
      setBooks([...books, data.book]);
      setTitle("");
      setGenre("");
    }
  };

  // Delete a book
  const handleDeleteBook = async (bookId) => {
    await fetch(`http://localhost:5000/api/books/${bookId}`, { method: "DELETE" });
    setBooks(books.filter((book) => book._id !== bookId));
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      {profile ? (
        <>
          <h2 className="text-2xl font-bold">Welcome, {profile.username}!</h2>

          {/* Write a Book */}
          <div className="my-4">
            <h3 className="font-bold">Write a Book</h3>
            <input className="border p-2 w-full mb-2" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="border p-2 w-full mb-2" type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
            <button className="bg-blue-500 text-white p-2 rounded" onClick={handleCreateBook}>Publish</button>
          </div>

          {/* List of User's Books */}
          <h3 className="font-bold mt-4">Your Books</h3>
          {books.length > 0 ? (
            <ul>
              {books.map((book) => (
                <li key={book._id} className="border p-2 rounded flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-bold">{book.title}</h4>
                    <p className="text-gray-500">{book.genre}</p>
                  </div>
                  <button className="bg-red-500 text-white p-2 rounded" onClick={() => handleDeleteBook(book._id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No books yet.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;

// import { useEffect, useState } from "react";

// const Profile = ({ user }) => {
//   const [profile, setProfile] = useState(null);
//   const [books, setBooks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [genre, setGenre] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:5000/api/auth/user", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setProfile(data);
//         fetch(`http://localhost:5000/api/profile/${data._id}`)
//           .then((res) => res.json())
//           .then((profileData) => setBooks(profileData.books));
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   // Create a new book
//   const handleCreateBook = async () => {
//     if (!profile) return;

//     const res = await fetch("http://localhost:5000/api/books", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, genre, author: profile._id }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       setBooks([...books, data.book]);
//       setTitle("");
//       setGenre("");
//     }
//   };

//   // Delete a book
//   const handleDeleteBook = async (bookId) => {
//     await fetch(`http://localhost:5000/api/books/${bookId}`, { method: "DELETE" });
//     setBooks(books.filter((book) => book._id !== bookId));
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       {profile ? (
//         <>
//           <h2 className="text-2xl font-bold">Welcome, {profile.username}!</h2>

//           {/* Write a Book */}
//           <div className="my-4">
//             <h3 className="font-bold">Write a Book</h3>
//             <input className="border p-2 w-full mb-2" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
//             <input className="border p-2 w-full mb-2" type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
//             <button className="bg-blue-500 text-white p-2 rounded" onClick={handleCreateBook}>Publish</button>
//           </div>

//           {/* List of User's Books */}
//           <h3 className="font-bold mt-4">Your Books</h3>
//           {books.length > 0 ? (
//             <ul>
//               {books.map((book) => (
//                 <li key={book._id} className="border p-2 rounded flex justify-between items-center mb-2">
//                   <div>
//                     <h4 className="font-bold">{book.title}</h4>
//                     <p className="text-gray-500">{book.genre}</p>
//                     <a href={`/book/${book._id}`} className="text-blue-500">View Chapters</a>
//                   </div>
//                   <button className="bg-red-500 text-white p-2 rounded" onClick={() => handleDeleteBook(book._id)}>Delete</button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No books yet.</p>
//           )}
//         </>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;

// // import { useEffect, useState } from "react";

// // const Profile = () => {
// //   const [profile, setProfile] = useState(null);
// //   const [books, setBooks] = useState([]);
// //   const [title, setTitle] = useState("");
// //   const [genre, setGenre] = useState("");
// //   const [newChapterTitle, setNewChapterTitle] = useState("");
// //   const [newChapterContent, setNewChapterContent] = useState("");
// //   const [selectedBookId, setSelectedBookId] = useState(null);

// //   useEffect(() => {
// //     fetch("http://localhost:5000/api/auth/user", {
// //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// //     })
// //       .then((res) => res.json())
// //       .then((data) => {
// //         setProfile(data);
// //         fetch(`http://localhost:5000/api/profile/${data._id}`)
// //           .then((res) => res.json())
// //           .then((profileData) => setBooks(profileData.books));
// //       })
// //       .catch((err) => console.error(err));
// //   }, []);

// //   // Create a new book
// //   const handleCreateBook = async () => {
// //     if (!profile) return;

// //     const res = await fetch("http://localhost:5000/api/books", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ title, genre, author: profile._id }),
// //     });

// //     const data = await res.json();
// //     if (res.ok) {
// //       setBooks([...books, data.book]);
// //       setTitle("");
// //       setGenre("");
// //     }
// //   };

// //   // Add a new chapter
// //   const handleCreateChapter = async (bookId) => {
// //     if (!bookId) {
// //       console.error("No bookId provided for chapter creation");
// //       return;
// //     }
// //     try {
// //       const res = await fetch("http://localhost:5000/api/chapters", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           title: newChapterTitle,
// //           content: newChapterContent,
// //           bookId,
// //         }),
// //       });
  
// //       if (!res.ok) throw new Error("Failed to create chapter");
  
// //       const data = await res.json();
// //       console.log("Chapter created:", data);
  
// //       setBooks((prevBooks) =>
// //         prevBooks.map((book) =>
// //           book._id === bookId
// //             ? { ...book, chapters: [...(book.chapters || []), data.chapter] }
// //             : book
// //         )
// //       );
  
// //       setNewChapterTitle("");
// //       setNewChapterContent("");
// //     } catch (error) {
// //       console.error("Error creating chapter:", error);
// //     }

// //     fetch("http://localhost:5000/api/chapters", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         bookId: selectedBookId,  // Make sure this value is correct
// //         title: chapterTitle,
// //         content: chapterContent,
// //       }),
// //     })
// //       .then((res) => res.json())
// //       .then((data) => console.log("Chapter created:", data))
// //       .catch((err) => console.error("Error creating chapter:", err));
    
// //   };
  

// //   return (
// //     <div className="p-6 max-w-lg mx-auto">
// //       {profile ? (
// //         <>
// //           <h2 className="text-2xl font-bold">Welcome, {profile.username}!</h2>

// //           {/* Write a Book */}
// //           <div className="my-4">
// //             <h3 className="font-bold">Write a Book</h3>
// //             <input className="border p-2 w-full mb-2" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
// //             <input className="border p-2 w-full mb-2" type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
// //             <button className="bg-blue-500 text-white p-2 rounded" onClick={handleCreateBook}>Publish</button>
// //           </div>

// //           {/* List of User's Books */}
// //           <h3 className="font-bold mt-4">Your Books</h3>
// //           {books.length > 0 ? (
// //             <ul>
// //               {books.map((book) => (
// //                 <li key={book._id} className="border p-2 rounded mb-2">
// //                   <h4 className="font-bold">{book.title}</h4>
// //                   <p className="text-gray-500">{book.genre}</p>

// //                   {/* Add Chapter Input */}
// //                   <div className="mt-2">
// //                     <input
// //                       className="border p-2 w-full mb-2"
// //                       type="text"
// //                       placeholder="Chapter Title"
// //                       value={newChapterTitle}
// //                       onChange={(e) => setNewChapterTitle(e.target.value)}
// //                     />
// //                     <textarea
// //                       className="border p-2 w-full mb-2"
// //                       placeholder="Chapter Content"
// //                       value={newChapterContent}
// //                       onChange={(e) => setNewChapterContent(e.target.value)}
// //                     ></textarea>
// //                     <button className="bg-green-500 text-white p-2 rounded" onClick={() => handleCreateChapter(book._id)}>
// //                       Add Chapter
// //                     </button>
// //                   </div>

// //                   {/* List of Chapters */}
// //                   {book.chapters?.length > 0 ? (
// //                     <ul className="mt-2">
// //                       {book.chapters.map((chapter) => (
// //                         <li key={chapter._id} className="text-blue-500 cursor-pointer" onClick={() => window.location.href = `/chapter/${chapter._id}`}>
// //                           {chapter.title}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   ) : (
// //                     <p>No chapters yet.</p>
// //                   )}
// //                 </li>
// //               ))}
// //             </ul>
// //           ) : (
// //             <p>No books yet.</p>
// //           )}
// //         </>
// //       ) : (
// //         <p>Loading...</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default Profile;

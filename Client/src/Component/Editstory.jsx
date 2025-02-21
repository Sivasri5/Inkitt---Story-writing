import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditStory = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setDescription(data.description);
    } catch (error) {
      console.error("Error fetching story:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Error updating story");

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Story</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <input className="w-full p-2 border rounded" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="w-full p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditStory;

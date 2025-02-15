import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Chapter = () => {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/chapters/${chapterId}`)
      .then((res) => res.json())
      .then((data) => setChapter(data))
      .catch((err) => console.error(err));
  }, [chapterId]);

  return (
    <div className="p-6">
      {chapter ? (
        <>
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
          <p className="mt-4">{chapter.content}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Chapter;

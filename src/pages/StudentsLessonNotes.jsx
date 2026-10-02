import React, { useEffect, useState } from "react";
import { BookOpen, Loader2, AlertCircle } from "lucide-react";
import { getStudentLessonNotes } from "../api/lessonNote.api";

export default function StudentLessonNotes() {
  const [lessonNotes, setLessonNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLessonNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStudentLessonNotes();

        console.log("STUDENT LESSON NOTES RESPONSE:", response);

        setLessonNotes(
          response?.data?.lessonNotes ||
          response?.lessonNotes ||
          []
        );
      } catch (error) {
        console.error("STUDENT LESSON NOTES ERROR:", error);

        setError(
          error?.response?.data?.message ||
          "Failed to load lesson notes"
        );
      } finally {
        setLoading(false);
      }
    };

    loadLessonNotes();
  }, []);

  if (loading) {
    return (
      <div>
        <Loader2 size={24} />
        <p>Loading lesson notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AlertCircle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Lesson Notes</h1>

      {lessonNotes.length === 0 ? (
        <div>
          <BookOpen size={40} />
          <h2>No lesson notes available</h2>
          <p>
            Your teachers have not published any lesson notes yet.
          </p>
        </div>
      ) : (
        lessonNotes.map((note) => (
          <div key={note._id}>
            <h2>{note.title}</h2>

            <p>
              <strong>Subject:</strong> {note.subject}
            </p>

            <p>
              <strong>Teacher:</strong>{" "}
              {note.teacher
                ? `${note.teacher.firstName} ${note.teacher.lastName}`
                : "N/A"}
            </p>

            <p>{note.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
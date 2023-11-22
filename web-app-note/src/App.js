import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState(null);
  const [profiles, setProfile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const newNote = {
    id: 0,
    title: "New note",
    body: "Write something here...",
    date: new Date().toLocaleString(),
  };

  const onAddNote = async () => {
    let previousId = 0;

    if (notes.length > 0) {
      previousId = notes[notes.length - 1].id;
    }
    try {
      newNote.id = previousId + 1
      const resp = await fetch("/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (resp.ok) {
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        setCurrentIndex(updatedNotes.length - 1);
      } else {
        console.log("An error occurred during the request: @+onAddNote");
      }
    } catch (error) {
      console.error("An error occurred during the request: @+onAddNote-try", error);
    }
  };

  const onDeleteNote = async () => {

    if (notes[currentIndex] == null) { return; }
    const confirmed = window.confirm("Are you sure to remove this note ?");

    if (!confirmed) {
      return;
    }

    try {
      const resp = await fetch(`/notes/${notes[currentIndex].id}`, {
        method: "DELETE",
      });

      if (resp.ok) {
        const updatedNotes = notes.filter((_, index) => index !== currentIndex)
          .map((note, index) => ({ ...note, id: index + 1 }));

        setNotes(updatedNotes);

        if (updatedNotes.length > 0) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(null);
        }

        await fetch("/update-json", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNotes),
        });
      } else {
        console.log("An error occurred during the request: @+onDeleteNote");
      }
    } catch (error) {
      console.error("An error occurred during the request: @+onDeleteNote-try", error);
    }
  };
  const onEditNote = () => {
    if (notes[currentIndex] == null) { return; }
    setIsEditing(true);
    setEditedContent(notes[currentIndex].body);
    setEditedTitle(notes[currentIndex].title);
  };

  const onClickNote = (id) => {
    setCurrentIndex(id - 1);
  };

  useEffect(function () {
    (async () => {
      const notesResponse = await fetch("/notes");
      const notesData = await notesResponse.json();
      setNotes(notesData);
    })();

    (async () => {
      const profileResponse = await fetch("/profiles");
      const profileData = await profileResponse.json();
      setProfile(profileData.name);
    })();
  }, []);


  const onSaveNote = async () => {
    const updatedNotes = [...notes];
    const updatedNote = { ...updatedNotes[currentIndex], body: editedContent, title: editedTitle };
    updatedNotes[currentIndex] = updatedNote;

    setNotes(updatedNotes);

    try {
      const resp = await fetch(`/notes/${updatedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      });

      if (resp.ok) {
        setIsEditing(false);
      } else {
        console.log("An error occurred during the request: @+onSaveNote");
      }
    } catch (error) {
      console.error("An error occurred during the request: @+onSaveNote-try", error);
    }
  };

  return (
    <>
      <aside className="Side">
        <div className="TitrePage">ZiNotes</div>
        <button className="AjoutNote" onClick={onAddNote}>
          +
        </button>
        <div className="ProfileName">Hi, {profiles}</div>
        {notes !== null
          ? notes.slice().reverse().map((note, index) => (
            <div key={index} onClick={() => onClickNote(note.id)}>
              <div className="Titles">
                {note.title}
                <div className="Creation">{note.date}</div>
                <div className="Id">{note.id}</div>
              </div>
            </div>
          ))
          : <div>click here to create your first note !</div>}
      </aside>

      <main className="Main">
        <div>
          {notes !== null ? (
            <div className="NotesContentTitle">
              {isEditing ? (
                <textarea
                  className="EditableTextTitle"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                (notes[currentIndex]?.title !== null && notes[currentIndex]?.title !== "")
                  ? notes[currentIndex]?.title
                  : <div>You have no one note for now</div>
              )}
            </div>
          ) : (
            <div>no note here</div>
          )}


        </div>
        <div>

          {notes !== null ? (
            <div className="NotesContent">
              {isEditing ? (
                <textarea
                  className="EditableTextArea"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                notes[currentIndex]?.body !== null
                  ? notes[currentIndex]?.body
                  : "You need to create your first note"
              )}
            </div>
          ) : (
            <div>no note here</div>
          )}

          {isEditing ? (
            <button className="SaveButton" onClick={onSaveNote}>
              Save
            </button>
          ) : (
            <button className="SaveButton" onClick={onEditNote}>
              Modify
            </button>
          )}

          <button className="DelButton" onClick={onDeleteNote}>
            Delete
          </button>
        </div>
      </main>
    </>
  );
}

export default App;

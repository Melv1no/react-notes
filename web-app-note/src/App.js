import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { FeedPlusIcon } from '@primer/octicons-react';

class Note {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

function App() {
  const [notes, setNotes] = useState([]);
  const [profile, setProfile] = useState("anonyme");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const noteTemplate = new Note("This is a new note", "write your memories here");

  const onAddNote = async () => {
    setCurrentIndex(notes.length + 1);
    onEditNote(true);
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

  const onEditNote = (isNewNote) => {
    if (isNewNote == true) {
      setEditedContent(noteTemplate.body);
      setEditedTitle(noteTemplate.title);
    } else if (currentIndex == null) { return; } else {
      setEditedContent(notes[currentIndex].body);
      setEditedTitle(notes[currentIndex].title);
    }
    setIsEditing(true);
  };

  const onSaveNote = async () => {
    try {
      if (currentIndex !== null) {
        const updatedNotes = [...notes];
        if (currentIndex > updatedNotes.length) {
          const updatedNotes = [...notes];

          console.log(currentIndex);
          console.log(updatedNotes.length);
          if (currentIndex > updatedNotes.length) {
            updatedNotes.push({ "id": currentIndex, "body": "t", title: "te", "date": new Date().toLocaleDateString() });
          }
          console.log(notes.length);

          updatedNotes[currentIndex - 1].body = editedContent;
          updatedNotes[currentIndex - 1].title = editedTitle;
          updatedNotes[currentIndex - 1].date = new Date().toLocaleDateString();

          setNotes(updatedNotes);

          await fetch(`/notes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedNotes[currentIndex - 1]),
          });

          setIsEditing(false);
        } else {
          updatedNotes[currentIndex].body = editedContent;
          updatedNotes[currentIndex].title = editedTitle;
          updatedNotes[currentIndex].date = new Date().toLocaleDateString();

          setNotes(updatedNotes);

          await fetch(`/notes/${updatedNotes[currentIndex].id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedNotes[currentIndex]),
          });

          setIsEditing(false);
        }
      } else {
        console.log("notes do not exist");
        console.log(notes.length);
        console.log(currentIndex);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const onClickNote = (id) => {
    const clickedNoteIndex = notes.findIndex((note) => note.id === id);
    setCurrentIndex(clickedNoteIndex);
    setIsEditing(false);
  };

  useEffect(() => {
    console.log("useEffect();");
    const fetchData = async () => {
      try {
        console.log("notes fetching");
        const notesResponse = await fetch('/notes');
        const notesData = await notesResponse.json();
        setNotes(notesData);

        console.log("profiles fetching");
        const profilesResponse = await fetch('/profiles');
        const profilesData = await profilesResponse.json();
        setProfile(profilesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <aside className="Side">
        <div className="TitrePage">ZiNotes</div>
        <button className="AjoutNote" onClick={onAddNote}>
          <FeedPlusIcon size={32} />
        </button>
        <div className="ProfileName">Hi, {profile.name}</div>
        {notes && notes.length > 0 ? (
          notes.slice().reverse().map((note) => (
            <div className="notebox" key={note.id} onClick={() => onClickNote(note.id)}>
              <div className="Titles">
                {note.title}
                <div className="Creation">{note.date}</div>
                <div className="Id">ID: {note.id}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center' }}>
            Click <a onClick={() => { onAddNote(); }}>here</a> to create your first note!
          </div>
        )}

        <div className="BottomButtonDiv">
          {isEditing ? (
            <button className="BottomButton" onClick={onSaveNote}>
              Save
            </button>
          ) : (
            <button className="BottomButton" onClick={onEditNote}>
              Modify
            </button>
          )}
          <button className="BottomButton" onClick={onDeleteNote}>
            Delete
          </button>
        </div>
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
                notes[currentIndex]?.body !== null && notes[currentIndex]?.body !== undefined
                  ? notes[currentIndex]?.body
                  : "You need to create your first note"
              )}
            </div>
          ) : (
            <div>no note here</div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;

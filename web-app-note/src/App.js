import "./App.css";
import React, { useEffect, useState } from "react";
import { FeedPlusIcon } from '@primer/octicons-react';
import Loader from './components/Loader';
import showPopup from "./components/Popup";
import NoteComponent from "./components/NoteComponent";
import NoteEditor from "./components/NoteEditor";
import SearchBar from "./components/SearchBar";
import NotesList from "./components/NotesList";
import NightModeToggle from "./components/NightModeToggle";

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
  const [loading, setLoading] = useState(false);
  const noteTemplate = new Note("This is a new note", "write your memories here");
  const [searchTerm, setSearchTerm] = useState("");

  const showLoader = (timeout) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, timeout);
  };

  const onAddNote = async () => {
    showLoader(1000);
    setCurrentIndex(notes.length + 1);
    onEditNote(true);
  };

  const onDeleteNote = async () => {
    showLoader(1000);
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

        showPopup('note deleted !');
      } else {
        console.log("An error occurred during the request: @+onDeleteNote");
      }
    } catch (error) {
      console.error("An error occurred during the request: @+onDeleteNote-try", error);
    }
  };

  const onEditNote = (isNewNote) => {
    showLoader(1000);
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
    showLoader(1000);
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

          setCurrentIndex(notes.length);
          setIsEditing(false);
          showPopup('note saved !');
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

          showPopup('note saved !');
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
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.body.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const onClickNote = (id) => {
    showLoader(200);
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
  const handleKeyDown = (e) => {
    // Check if the pressed key is the "Escape" key (key code 27)
    if (e.key === 'Escape') {
      // Clear the input field by updating the state
      setSearchTerm('');
    }
  };
  const highlightSearchTerm = (text) => {
    if (!searchTerm) {
      return text;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };
  const highlightSearchTermInBody = (body) => {
    if (!searchTerm) {
      return body;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return body.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };

  return (
    <>
    
      <aside className="Side">
        <div className="TitrePage">Mes notes</div>
        <div onClick={onAddNote} className="AjoutNote">
            
            Add notes <i className="fas fa-plus"></i>
            </div>
        <SearchBar
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          handleKeyDown={handleKeyDown}
        />
        <div className="nightmode"><NightModeToggle /></div> 
        <div className="ProfileName">Hi, {profile.name}</div>
        <NotesList
          filteredNotes={filteredNotes}
          onClickNote={onClickNote}
          highlightSearchTermInBody={highlightSearchTermInBody}
          highlightSearchTerm={highlightSearchTerm}
        />
        <NoteEditor
          isEditing={isEditing}
          onSaveNote={onSaveNote}
          onEditNote={onEditNote}
          onDeleteNote={onDeleteNote}
          editedTitle={editedTitle}
          editedContent={editedContent}
        />
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
                  ? <div dangerouslySetInnerHTML={{ __html: highlightSearchTermInBody(notes[currentIndex]?.body) }} />
                  : "You need to create your first note"
              )}
            </div>
          ) : (
            <div>no note here</div>
          )}
        </div>
      </main>

      <div>
        {loading && (
          <div className="overlay">
            <Loader />
          </div>
        )}

        <div className={`content ${loading ? 'blurred' : ''}`}>

        </div>
      </div>
    </>
  );
}

export default App;

// Importing necessary modules and components from React and React Router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import React, { useEffect, useState } from "react";
import Loader from './components/Loader';
import showPopup from "./components/Popup";
import NoteEditor from "./components/NoteEditor";
import SearchBar from "./components/SearchBar";
import NotesList from "./components/NotesList";
import NightModeToggle from "./components/NightModeToggle";
import { fetchNotes, fetchProfiles, addNote, deleteNote, updateNotes,updateSingleNote } from "./services/api";


// Class representing a Note with a title and body
class Note {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

// Main functional component for the application
function App() {
  // State variables using the useState hook to manage component state
  const [notes, setNotes] = useState([]);
  const [profile, setProfile] = useState("anonyme");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const noteTemplate = new Note("This is a new note", "write your memories here");
  const [searchTerm, setSearchTerm] = useState("");
  const [noteEditingStatus, setNoteEditingStatus] = useState(false);
  const [isNewNote, setIsNewNote] = useState(false);

  // Function to show a loader with a given timeout
  const showLoader = (timeout) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, timeout);
  };

  // Function to add a new note
  const onAddNote = async () => {
    showLoader(1000);
    const newId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 1;
    console.log(newId);
    setCurrentIndex(newId);
    setIsNewNote(true);
    onEditNote(isNewNote);
    setIsNewNote(false);
  };

  // Function to delete a note
  const onDeleteNote = async () => {
    showLoader(1000);
    if (notes[currentIndex] == null) {
      return;
    }
    const confirmed = window.confirm("Are you sure to remove this note ?");
  
    if (!confirmed) {
      return;
    }
  
    try {
      // Deleting the note from the server
      const deletionSuccessful = await deleteNote(notes[currentIndex].id);
  
      if (deletionSuccessful) {
        // Updating the local state and server with the modified notes
        const updatedNotes = notes
          .filter((_, index) => index !== currentIndex)
          .map((note, index) => ({ ...note, id: index + 1 }));
  
        setNotes(updatedNotes);
  
        if (updatedNotes.length > 0) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(null);
        }
  
        await updateNotes(updatedNotes);
  
        // Showing a popup notification
        showPopup('note deleted !');
      }
    } catch (error) {
      console.error("An error occurred during the deleteNote request:", error);
    }
  };
  

  // Function to edit a note
  const onEditNote = (isNewNote) => {
    showLoader(1000);
    
    setNoteEditingStatus(true);
    if (!isNewNote) {
      setEditedContent(noteTemplate.body);
      setEditedTitle(noteTemplate.title);
      
      setNoteEditingStatus(false);
      console.log("is new note");
    } else if (currentIndex == null) { return; console.log("null index");} else {
      console.log("not null");
      setEditedContent(notes[currentIndex].body);
      setEditedTitle(notes[currentIndex].title);
    }

    if (currentIndex !== null) {
      setNoteEditingStatus((prevStatus) => ({
        ...prevStatus,
        [currentIndex + 1]: true,
      }));
    }
  };

  // Function to save a note
  const onSaveNote = async () => {
    showLoader(1000);
    try {
      if (currentIndex !== null) {
        const updatedNotes = [...notes];
        if (currentIndex > updatedNotes.length) {
          console.log(currentIndex);
          console.log(updatedNotes.length);
          if (currentIndex > updatedNotes.length) {
            updatedNotes.push({ "id": currentIndex, "body": "t", title: "te", "date": new Date().toLocaleDateString() });
          }
          console.log(notes.length);

          updatedNotes[updatedNotes.length - 1].body = editedContent;
          updatedNotes[currentIndex - 1].title = editedTitle;
          updatedNotes[currentIndex - 1].date = new Date().toLocaleDateString();

          setNotes(updatedNotes);

          // Adding a new note to the server
          await addNote(updatedNotes[currentIndex - 1]);

          setCurrentIndex(notes.length);
          // Showing a popup notification
          showPopup('note saved !');
        } else {
          updatedNotes[currentIndex].body = editedContent;
          updatedNotes[currentIndex].title = editedTitle;
          updatedNotes[currentIndex].date = new Date().toLocaleDateString();

          setNotes(updatedNotes);

          // Updating an existing note on the server
          console.log("await for");

          await updateSingleNote(updatedNotes[currentIndex].id,updatedNotes[currentIndex]);

          setNoteEditingStatus(false);
          // Showing a popup notification
          showPopup('note saved !');
          onClickNote(updatedNotes[currentIndex].id);
        }
      } else {
        console.log("notes do not exist");
        console.log(notes.length);
        console.log(currentIndex);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
    setNoteEditingStatus(false);
  };

  // Function to handle search term changes
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  // Filtering notes based on the search term
  const filteredNotes = notes && notes.filter((note) =>
    (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (note.body && note.body.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];



  // Function to handle keydown event (e.g., Esc key for clearing search)
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
    }
  };

  // Function to highlight the search term in text
  const highlightSearchTerm = (text) => {
    if (!searchTerm) {
      return text;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };

  // Function to highlight the search term in the note body
  const highlightSearchTermInBody = (body) => {
    if (!searchTerm) {
      return body;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return body.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };

  // Function to handle clicking on the home button
  const onClickHome = () => {
    showLoader(200);
    setCurrentIndex(null);
    setSearchTerm("");
    setNoteEditingStatus(false);
  };

  // Function to handle clicking on a note
  const onClickNote = (id) => {
    showLoader(200);
    const clickedNoteIndex = notes.findIndex((note) => note.id === id);
    setCurrentIndex(clickedNoteIndex);
  };

  // useEffect hook for fetching data when the component mounts
  useEffect(() => {
    // Setting up an interval to automatically save the note every 30 seconds
    const saveInterval = setInterval(() => {
      if (currentIndex !== null) {
        onSaveNote();
      }
    }, 30000);
  
    // Fetching data from the server when the component mounts
    const fetchData = async () => {
      try {
        // Fetching notes data
        console.log("notes fetching");
        const notesData = await fetchNotes();
        setNotes(notesData);
  
        // Fetching profile data
        console.log("profiles fetching");
        const profilesData = await fetchProfiles();
        setProfile(profilesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };
    fetchData();
  
    window.history.replaceState(null, null, '/');
    // Cleanup function for clearing the saveInterval
    return () => {
      clearInterval(saveInterval);
    };
  
  }, []);

  // JSX structure for the main application
  return (
    <Router>
      <div>
        {/* Sidebar section */}
        <aside className="Side">
          {/* Title of the page */}
          <div className="TitrePage" onClick={onClickHome}>Mes notes</div>
          {/* Button to add a new note */}
          <div onClick={onAddNote} className="AjoutNote">
            Add notes <i className="fas fa-plus"></i>
          </div>
          {/* Search bar */}
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            handleKeyDown={handleKeyDown}
          />
          {/* Night mode toggle */}
          <div className="nightmode"><NightModeToggle /></div>
          {/* Displaying the profile name */}
          <div className="ProfileName">Hi, {profile.name}</div>
          {/* List of notes */}
          <NotesList
            filteredNotes={filteredNotes}
            onClickNote={onClickNote}
            highlightSearchTermInBody={highlightSearchTermInBody}
            highlightSearchTerm={highlightSearchTerm}
            currentnoteid={currentIndex}
            noteEditingStatus={noteEditingStatus}
          />
          {/* Note editor section */}
          <NoteEditor
            onSaveNote={onSaveNote}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
            noteEditingStatus={noteEditingStatus}
          />
        </aside>

        {/* Main content section */}
        <main className="Main">
          <div>
            {notes !== null ? (
              <div className="NotesContentTitle">
                {noteEditingStatus ? (
                  // Text area for editing the title
                  <textarea
                    className="EditableTextTitle"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                ) : (
                  // Displaying the title of the current note or a message if no note exists
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
                {noteEditingStatus ? (
                  // Text area for editing the note body
                  <textarea
                    className="EditableTextArea"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                ) : (
                  // Displaying the body of the current note or a message if no note exists
                  notes[currentIndex]?.body !== null && notes[currentIndex]?.body !== undefined
                    ? <div dangerouslySetInnerHTML={{ __html: highlightSearchTermInBody(notes[currentIndex]?.body) }} />
                    : "Create a new note or click on existing note."
                )}
              </div>
            ) : (
              <div>no note here</div>
            )}
          </div>
        </main>

        {/* Loading and blurred content sections */}
        <div>
          {loading && (
            // Overlay with loader when loading is in progress
            <div className="overlay">
              <Loader />
            </div>
          )}

          {/* Content section with or without blur based on loading state */}
          <div className={`content ${loading ? 'blurred' : ''}`}>
          </div>
        </div>
      </div>
    </Router>
  );
}

// Exporting the App component as the default export
export default App;

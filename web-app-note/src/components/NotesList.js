import React from "react";
import NoteComponent from "./NoteComponent";

const NotesList = ({ filteredNotes, onClickNote, highlightSearchTermInBody, highlightSearchTerm, isEditing, currentnoteid, noteEditingStatus }) => {
  return (
    <>
      {filteredNotes && filteredNotes.length > 0 ? (
        filteredNotes.slice().reverse().map((note) => (
          <NoteComponent
            key={note.id}
            note={note}
            onClickNote={onClickNote}
            highlightSearchTerm={highlightSearchTerm}
            isEditing={isEditing}
            currentnoteid={currentnoteid}
            noteEditingStatus={noteEditingStatus[note.id]} 
          />
        ))
      ) : (
        <div style={{ textAlign: 'center', paddingTop: "25px" }}>
          No matching notes found.
        </div>
      )}
    </>
  );
};

export default NotesList;

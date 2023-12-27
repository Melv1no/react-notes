import React from "react";
import NoteComponent from "./NoteComponent";

const NotesList = ({ filteredNotes, onClickNote, highlightSearchTermInBody, highlightSearchTerm }) => {
  return (
    <>
      {filteredNotes && filteredNotes.length > 0 ? (
        filteredNotes.slice().reverse().map((note) => (
          <NoteComponent
            key={note.id}
            note={note}
            onClickNote={onClickNote}
            highlightSearchTerm={highlightSearchTerm}
          />
        ))
      ) : (
        <div style={{ textAlign: 'center' }}>
          No matching notes found.
        </div>
      )}
    </>
  );
};

export default NotesList;

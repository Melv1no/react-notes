import React from "react";

const NoteComponent = ({ note, onClickNote, highlightSearchTermInBody, highlightSearchTerm }) => {
  return (
    <div key={note.id} onClick={() => onClickNote(note.id)}>
      <div className="Notebox">
        <div dangerouslySetInnerHTML={{ __html: highlightSearchTerm(note.title) }} />
        <div className="Creation">{note.date}</div>
        <div className="Id">ID: {note.id}</div>
      </div>
    </div>
  );
};

export default NoteComponent;

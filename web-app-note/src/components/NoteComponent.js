import React from "react";
import { Link } from 'react-router-dom';

const NoteComponent = ({ note, onClickNote, highlightSearchTermInBody, highlightSearchTerm, isEditing, currentnoteid, noteEditingStatus }) => {
  const getStatusText = () => {
    if (noteEditingStatus) {
      return "Editing...";
    } else {
      return "Saved";
    }
  };

  return (
    <Link to={`/note/${note.id || 'new'}`} key={note.id}>
      <div onClick={() => onClickNote(note.id)}>
        <div className="Notebox">
          <div dangerouslySetInnerHTML={{ __html: highlightSearchTerm(note.title) }} />
          <div className="Creation">{note.date}</div>
          <div className="Id">ID: {note.id}</div>
          <div className="status">{getStatusText()}</div>
        </div>
      </div>
    </Link>
  );
};

export default NoteComponent;

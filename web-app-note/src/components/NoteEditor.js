import React from "react";

const NoteEditor = ({ onSaveNote, onEditNote, onDeleteNote,noteEditingStatus }) => {
    return (

        <div className="BottomButtonDiv">
            {noteEditingStatus ? (
                <button className="BottomButton" onClick={onSaveNote}>
                    Save <i className="fas fa-save"></i>
                </button>
            ) : (
                <button className="BottomButton" onClick={onEditNote}>
                    Modify <i className="fas fa-edit"></i>
                </button>
            )}
            <button className="BottomButton" onClick={onDeleteNote}>
                Delete <i className="fas fa-trash"></i>
            </button>
        </div>
    );
};

export default NoteEditor;

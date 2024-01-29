
export const fetchNotes = async () => {
  try {
    const response = await fetch('https://web-api-note-a70ef9506447.herokuapp.com/notes');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notes :', error);
    throw error;
  }
};

export const fetchProfiles = async () => {
  try {
    const response = await fetch('https://web-api-note-a70ef9506447.herokuapp.com/profiles');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des profils :', error);
    throw error;
  }
};

export const addNote = async (note) => {
  try {
    const response = await fetch('https://web-api-note-a70ef9506447.herokuapp.com/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note :', error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`https://web-api-note-a70ef9506447.herokuapp.com/notes/${noteId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return true;
    } else {
      console.error("An error occurred during the request: @+deleteNote");
      return false;
    }
  } catch (error) {
    console.error("An error occurred during the request: @+deleteNote-try", error);
    throw error;
  }
};

export const updateNotes = async (updatedNotes) => {
  try {
    const response = await fetch("https://web-api-note-a70ef9506447.herokuapp.com/update-json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNotes),
    });

    if (!response.ok) {
      console.error("An error occurred during the request: @+updateNotes");
    }
  } catch (error) {
    console.error("An error occurred during the request: @+updateNotes-try", error);
    throw error;
  }
};

export const updateSingleNote = async (noteid, note) => {
  try {
    const response = await fetch(`https://web-api-note-a70ef9506447.herokuapp.com/notes/${noteid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      console.error("An error occurred during the request: @+updateSingleNote");
    }
  } catch (error) {
    console.error("An error occurred during the request: @+updateSingleNote-try", error);
    throw error;
  }

};
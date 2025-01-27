const createHometaskSetter = (weekIndex, dayIndex, subjectIndex) => (dispatch, getState) => {
    const subjects = getState().weekList.weekList[weekIndex].days[dayIndex].subjects;
    const { subjShort, type, numSubgroup, employees } = subjects[subjectIndex];

    return (newHometask) => {
        const updatedSubjects = subjects.map((item) => {
            if (
                item.subjShort === subjShort && item.type === type &&
                item.numSubgroup === numSubgroup && item.employees[0].id === employees[0].id
            ) {
                return { ...item, hometask: newHometask };
            }

            return item;
        });

        dispatch({
            type: "weekList/setHometask",
            payload: { weekIndex, dayIndex, updatedSubjects }
        });
    }
}

const createNotesSetters = (weekIndex, dayIndex) => (dispatch, getState) => {
    const notes = getState().weekList.weekList[weekIndex].days[dayIndex].notes;
    const action = {
        type: "weekList/setNotesList",
        payload: { weekIndex, dayIndex }
    };

    return {
        addNote(newNote) {
            action.payload.notesList = [...notes, newNote];
            dispatch(action);
        },
        editNote(editedNote) {
            action.payload.notesList = notes.map(note => note.id === editedNote.id ? editedNote : note);
            dispatch(action);
        },
        deleteNote(delId) {
            action.payload.notesList = notes.filter(({ id }) => id !== delId);
            dispatch(action);
        }
    };
}

export { createHometaskSetter, createNotesSetters };
import { setHometask, setNotesList } from "./slices/weekListSlice";

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

        dispatch(setHometask({ weekIndex, dayIndex, updatedSubjects }));
    }
}

const createNotesSetters = (weekIndex, dayIndex) => (dispatch, getState) => {
    const notes = getState().weekList.weekList[weekIndex].days[dayIndex].notes;
    const payload = { weekIndex, dayIndex };

    return {
        addNote(newNote) {
            payload.notesList = [...notes, newNote];
            dispatch(setNotesList(payload));
        },
        editNote(editedNote) {
            payload.notesList = notes.map(note => note.id === editedNote.id ? editedNote : note);
            dispatch(setNotesList(payload));
        },
        deleteNote(delId) {
            payload.notesList = notes.filter(({ id }) => id !== delId);
            dispatch(setNotesList(payload));
        }
    };
}

export { createHometaskSetter, createNotesSetters };
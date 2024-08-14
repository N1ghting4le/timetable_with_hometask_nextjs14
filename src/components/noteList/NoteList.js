'use client';

import { useState, useEffect } from "react";
import Note from "../note/Note";
import styles from './noteList.module.css';

const NoteList = ({ notes, setOpen, setActiveIndex, queryState, resetQueryState, sendRequest }) => {
    const [triggerIndex, setTriggerIndex] = useState(-1);

    useEffect(() => setTriggerIndex(-1), [notes]);
    useEffect(() => resetQueryState(), [triggerIndex]);

    const renderNotes = () => notes.length ? notes.map((note, i) => (
        <Note 
            key={note.id}
            i={i}
            notes={notes}
            setOpen={setOpen}
            setActiveIndex={setActiveIndex}
            sendRequest={sendRequest}
            queryState={queryState}
            triggerIndex={triggerIndex}
            setTriggerIndex={setTriggerIndex}/>
    )) : null;

    const noteElems = renderNotes();

    return noteElems ? <div className={styles.notes}>{noteElems}</div> : <h2>Нет заметок</h2>;
}

export default NoteList;
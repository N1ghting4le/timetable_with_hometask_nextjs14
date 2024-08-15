'use client';

import { useState, useEffect } from "react";
import Note from "../Note/Note";
import styles from './noteList.module.css';

const NoteList = ({ notes, resetQueryState }) => {
    const [triggerIndex, setTriggerIndex] = useState(-1);

    useEffect(() => resetQueryState(), [triggerIndex]);

    const renderNotes = () => notes.map((note, i) => (
        <Note
            key={note.id}
            i={i}
            notes={notes}
            triggerIndex={triggerIndex}
            setTriggerIndex={setTriggerIndex}/>
    ));

    const noteElems = renderNotes();

    return noteElems.length ? <div className={styles.notes}>{noteElems}</div> : <h2>Нет заметок</h2>;
}

export default NoteList;
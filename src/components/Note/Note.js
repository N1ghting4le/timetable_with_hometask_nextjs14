'use client';

import styles from './note.module.css';

const Note = ({ i, text, setOpen, setActiveNoteIndex }) => {
    const openNote = () => {
        setOpen(2);
        setActiveNoteIndex(i);
    }

    return (
        <div className={styles.note} onClick={openNote}>{text}</div>
    );
}

export default Note;
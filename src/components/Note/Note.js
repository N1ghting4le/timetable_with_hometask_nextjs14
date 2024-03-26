'use client';

import styles from './note.module.css';

const Note = ({ id, text }) => {
    return (
        <div className={styles.note}>{text}</div>
    );
}

export default Note;
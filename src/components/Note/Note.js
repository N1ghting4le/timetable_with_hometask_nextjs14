'use client';

import { useState, useEffect } from 'react';
import { useNote } from '../dayModal/DayModal';
import { useNotes } from '../GlobalContext';
import QueryStateDisplay from "../queryStateDisplay/QueryStateDisplay";
import WithContextMenu from '../WithContextMenu';
import ContextMenu from '../contextMenu/ContextMenu';
import styles from './note.module.css';

const Note = WithContextMenu(({ i, notes, triggerContextMenu }) => {
    const { id, text } = notes[i];
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const { setOpen, setActiveIndex, queryState, sendRequest } = useNote();
    const { deleteNote } = useNotes();
    const isDisabled = queryState === 'pending';

    useEffect(() => {
        if (queryState !== 'error' && isError) setIsError(false);
    }, [queryState]);

    const openNote = () => {
        setOpen(2);
        setActiveIndex(i);
    }

    const removeNote = () => {
        setIsPending(true);
        sendRequest("DELETE", { id }, deleteNote(notes, i))
            .catch(() => setIsError(true))
            .finally(() => setIsPending(false));
    }

    const onContextMenu = (e) => {
        if (isDisabled) return;

        triggerContextMenu(e);
    }

    return (
        <>
            <div className={styles.note} onContextMenu={onContextMenu}>{text}</div>
            <ContextMenu>
                <button onClick={openNote} disabled={isDisabled}>Редактировать</button>
                <button onClick={removeNote} disabled={isDisabled}>Удалить</button>
            </ContextMenu>
            { isPending || isError ? <QueryStateDisplay queryState={queryState}/> : null }
        </>
    );
}, { width: 150 });

export default Note;
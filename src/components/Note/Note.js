'use client';

import { useNotes } from '../GlobalContext';
import useContextMenu from '@/hooks/contextMenu.hook';
import QueryStateDisplay from "../queryStateDisplay/QueryStateDisplay";
import ContextMenu from '../contextMenu/ContextMenu';
import styles from './note.module.css';

const Note = ({ i, notes, setOpen, setActiveIndex, sendRequest, queryState, triggerIndex, setTriggerIndex }) => {
    const { id, text } = notes[i];
    const { deleteNote } = useNotes();
    const contextWidth = 150;
    const { triggerContextMenu, ...props } = useContextMenu(contextWidth);
    const isDisabled = queryState === 'pending';

    const openNote = () => {
        setOpen(2);
        setActiveIndex(i);
    }

    const removeNote = () => sendRequest("DELETE", { id }, deleteNote(notes, i));

    const onContextMenu = (e) => {
        if (isDisabled) return;

        setTriggerIndex(i);
        triggerContextMenu(e);
    }

    return (
        <>
            <div className={styles.note} onContextMenu={onContextMenu}>{text}</div>
            <ContextMenu {...props}>
                <button onClick={openNote} disabled={isDisabled}>Редактировать</button>
                <button onClick={removeNote} disabled={isDisabled}>Удалить</button>
            </ContextMenu>
            { triggerIndex === i ? <QueryStateDisplay queryState={queryState}/> : null }
        </>
    );
}

export default Note;
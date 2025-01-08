'use client';

import { useNote } from '../dayModal/DayModal';
import QueryStateDisplay from "../queryStateDisplay/QueryStateDisplay";
import WithContextMenu from '../WithContextMenu';
import ContextMenu from '../contextMenu/ContextMenu';
import styles from './note.module.css';

const Note = WithContextMenu(({ i, notes, triggerContextMenu }) => {
    const { id, text } = notes[i];
    const { setOpen, activeIndex, setActiveIndex, queryState, sendRequest, deleteNote } = useNote();
    const isDisabled = queryState === 'pending';

    const removeNote = () => sendRequest("DELETE", { id }, deleteNote(notes, i))
        .then(() => setActiveIndex(-1));

    const onContextMenu = (e) => {
        if (isDisabled) return;

        setActiveIndex(i);
        triggerContextMenu(e);
    }

    return (
        <>
            <div className={styles.note} onContextMenu={onContextMenu}>{text}</div>
            <ContextMenu>
                <button onClick={() => setOpen(2)} disabled={isDisabled}>Редактировать</button>
                <button onClick={removeNote} disabled={isDisabled}>Удалить</button>
            </ContextMenu>
            {activeIndex === i && <QueryStateDisplay queryState={queryState}/>}
        </>
    );
}, { width: 150 });

export default Note;
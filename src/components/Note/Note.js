'use client';

import { useNote } from '../dayModal/DayModal';
import QueryStateDisplay from "../queryStateDisplay/QueryStateDisplay";
import WithContextMenu from '../WithContextMenu';
import ContextMenu from '../contextMenu/ContextMenu';
import styles from './note.module.css';

const Note = WithContextMenu(({ i, notes, triggerContextMenu }) => {
    const { id, text, files } = notes[i];
    const { setOpen, activeIndex, setActiveIndex, queryState, sendRequest, deleteNote } = useNote();
    const isDisabled = queryState === 'pending';

    const removeNote = () => sendRequest("DELETE", JSON.stringify({ id }), deleteNote(notes, i), {
        'Content-type': 'application/json'
    });

    const openNote = async () => {
        if (isDisabled) return;

        await setActiveIndex(i);
        setOpen(2);
    }

    const onContextMenu = (e) => {
        if (isDisabled) return;

        setActiveIndex(i);
        triggerContextMenu(e);
    }

    return (
        <>
            <div className={styles.note} onContextMenu={onContextMenu} onClick={openNote}>
                {text && <p style={{marginBottom: files.length ? 10 : 0}}>{text}</p>}
                {files.length ? <p className={styles.fileText}>Есть прикреплённые файлы</p> : null}
            </div>
            <ContextMenu>
                <button onClick={removeNote} disabled={isDisabled}>Удалить</button>
            </ContextMenu>
            {activeIndex === i && <QueryStateDisplay queryState={queryState}/>}
        </>
    );
}, { width: 100 });

export default Note;
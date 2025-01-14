'use client';

import { SERVER_URL } from '@/env/env';
import { useState, useEffect, useContext, createContext } from 'react';
import useQuery from '@/hooks/query.hook';
import { useGroupNum, useNotes } from '../GlobalContext';
import { v4 as uuid } from 'uuid';
import UndoIcon from '@mui/icons-material/Undo';
import Modal from '../modal/Modal';
import Form from '../form/Form';
import NoteList from '../noteList/NoteList';
import styles from './dayModal.module.css';
import "./modal.css";

const Context = createContext();

const DayModal = ({ open, setOpen, notes, date, weekIndex, dayIndex }) => {
    const { setNotes, editNote, deleteNote } = useNotes(weekIndex, dayIndex);
    const { queryState, query, resetQueryState } = useQuery();
    const groupNum = useGroupNum();
    const [activeNoteIndex, setActiveNoteIndex] = useState(-1);
    const [files, setFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
    const inputId = "noteInput";
    const url = `${SERVER_URL}/notes`;
    const activeNote = notes[activeNoteIndex];

    useEffect(resetQueryState, [open]);
    useEffect(() => {
        setOldFiles(activeNote?.files || []);
        setFiles([]);
    }, [activeNoteIndex]);

    const closeModal = (num = 0) => {
        if (queryState === 'pending') return;

        setOpen(num);
        setActiveNoteIndex(-1);
    }

    const sendRequest = (method, body, newNoteList, headers = {}) =>
        query(url, method, body, headers)
            .then(() => {
                setNotes(newNoteList);
                closeModal(1);
            });

    const sendNote = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");

        if (activeNote?.text == text && !files.length && oldFiles.every(file => !file.toDelete))
            return closeModal(1);

        if (!activeNote) {
            const filesInfo = files.map(({ name }) => ({ id: uuid(), title: name }));
            const body = {
                id: uuid(),
                date,
                groupNum,
                filesInfo: JSON.stringify(filesInfo)
            };

            for (const key in body) {
                formData.append(key, body[key]);
            }

            files.forEach(file => formData.append("files", file));

            const { date: a, groupNum: b, filesInfo: c, ...newNote } = body;

            sendRequest("POST", formData, [...notes, { ...newNote, text, files: filesInfo }]);
        } else {
            const filesInfo = files.map(({ name }) => ({ id: uuid(), title: name }));
            const body = {
                id: activeNote.id,
                filesInfo: JSON.stringify(filesInfo),
                deletedFilesIds: JSON.stringify(oldFiles
                    .filter(file => file.toDelete).map(({ id }) => id))
            };

            for (const key in body) {
                formData.append(key, body[key]);
            }

            files.forEach(file => formData.append("files", file));

            sendRequest("PATCH", formData, editNote(notes, activeNoteIndex, {
                ...activeNote,
                text,
                files: [...oldFiles.filter(file => !file.toDelete), ...filesInfo]
            }));
        }
    }

    const provider = {
        activeIndex: activeNoteIndex,
        setActiveIndex: setActiveNoteIndex,
        setOpen, queryState, sendRequest, deleteNote
    };

    return (
        <Modal open={!!open} onClose={() => closeModal()} className="day" process={queryState}>
            {
                open === 1 ?
                <Context.Provider value={provider}>
                    <NoteList notes={notes}/>
                    <button className={styles.addNoteBtn} onClick={() => setOpen(2)}>+</button>
                </Context.Provider> : open === 2 ?
                <>
                    <UndoIcon className={styles.backArrow} onClick={() => closeModal(1)}/>
                    { activeNoteIndex >= 0 ? <h2>Заметка &#8470;{activeNoteIndex + 1}</h2> : <h2>Новая заметка</h2> }
                    <Form 
                        id={inputId}
                        className={styles.input}
                        onSubmit={sendNote}
                        process={queryState}
                        text={activeNote?.text}
                        oldFiles={oldFiles}
                        setOldFiles={setOldFiles}
                        files={files}
                        setFiles={setFiles}/>
                </> : null
            }
        </Modal>
    );
}

export default DayModal;

export const useNote = () => useContext(Context);
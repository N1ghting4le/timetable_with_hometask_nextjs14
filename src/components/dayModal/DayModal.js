'use client';

import { SERVER_URL } from '@/env/env';
import { useState, useEffect, useContext, createContext } from 'react';
import useQuery from '@/hooks/query.hook';
import { useDispatch } from 'react-redux';
import { createNotesSetters } from '@/store/setters';
import { v4 as uuid } from 'uuid';
import UndoIcon from '@mui/icons-material/Undo';
import Modal from '../modal/Modal';
import Form from '../form/Form';
import Note from '../Note/Note';
import styles from './dayModal.module.css';
import "./modal.css";

export const fillFormData = (formData, body, files) => {
    for (const key in body) {
        formData.append(key, body[key]);
    }

    files.forEach(file => formData.append("files", file));
}

const Context = createContext();

const DayModal = ({ open, setOpen, notes, date, weekIndex, dayIndex, groupNum }) => {
    const dispatch = useDispatch();
    const { addNote, editNote, deleteNote } = dispatch(createNotesSetters(weekIndex, dayIndex));
    const { queryState, query, resetQueryState } = useQuery();
    const [activeNoteIndex, setActiveNoteIndex] = useState(-1);
    const [files, setFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
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

    const sendRequest = (method, body, callback, headers = {}) => query(url, method, body, headers)
        .then(() => {
            callback();
            closeModal(1);
            setFiles([]);
        });

    const sendNote = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");

        if (
            ((!activeNote && !text) || activeNote?.text == text) &&
            !files.length && oldFiles.every(file => !file.toDelete)
        ) {
            return closeModal(1);
        }

        if (activeNote && !text && !files.length && oldFiles.every(file => file.toDelete)) {
            const id = activeNote.id;
            return sendRequest("DELETE", JSON.stringify({ id }), () => deleteNote(id), {
                'Content-type': 'application/json'
            });
        }

        const filesInfo = files.map(({ name }) => ({ id: uuid(), title: name }));

        if (!activeNote) {
            const body = {
                id: uuid(),
                date,
                groupNum,
                filesInfo: JSON.stringify(filesInfo)
            };

            fillFormData(formData, body, files);

            const { date: a, groupNum: b, filesInfo: c, ...newNote } = body;

            sendRequest("POST", formData, () => addNote({ ...newNote, text, files: filesInfo }));
        } else {
            const body = {
                id: activeNote.id,
                filesInfo: JSON.stringify(filesInfo),
                deletedFilesIds: JSON.stringify(oldFiles.filter(file => file.toDelete).map(({ id }) => id))
            };

            fillFormData(formData, body, files);

            sendRequest("PATCH", formData, () => editNote({
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
                    {notes.length ?
                    <div className={styles.notes}>
                        {notes.map((note, i) => <Note key={note.id} i={i} notes={notes}/>)}
                    </div> : <h2>Нет заметок</h2>}
                    <button className={styles.addNoteBtn} onClick={() => setOpen(2)}>+</button>
                </Context.Provider> : open === 2 ?
                <>
                    <UndoIcon className={styles.backArrow} onClick={() => closeModal(1)}/>
                    <h2>{activeNoteIndex >= 0 ? `Заметка №${activeNoteIndex + 1}` : "Новая заметка"}</h2>
                    <Form
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
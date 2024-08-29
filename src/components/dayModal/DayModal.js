'use client';

import { SERVER_URL } from '@/env/env';
import { useState, useEffect, useContext, createContext } from 'react';
import useQuery from '@/hooks/query.hook';
import { useGroupNum, useNotes } from '../GlobalContext';
import { v4 as uuid } from 'uuid';
import Image from 'next/image';
import Modal from '../modal/Modal';
import Form from '../form/Form';
import NoteList from '../noteList/NoteList';
import styles from './dayModal.module.css';
import "./modal.css";

const Context = createContext();

const DayModal = ({ open, setOpen, notes, date, weekIndex, dayIndex }) => {
    const { setNotes, editNote } = useNotes();
    const { queryState, query, resetQueryState } = useQuery();
    const groupNum = useGroupNum();
    const [activeNoteIndex, setActiveNoteIndex] = useState(-1);
    const inputId = "noteInput";
    const url = `${SERVER_URL}/notes`;
    const activeNote = notes[activeNoteIndex];

    useEffect(() => resetQueryState(), [open]);

    const closeModal = (num = 0) => {
        if (queryState === 'pending') return;

        setOpen(num);
        setActiveNoteIndex(-1);
    }

    const sendRequest = async (method, body, newNoteList) => (
        query(url, method, JSON.stringify(body))
            .then(() => {
                setNotes(newNoteList, weekIndex, dayIndex);
                closeModal(1);
            })
    );

    const sendNote = () => {
        const text = document.querySelector(`#${inputId}`).value;

        if ((text === activeNote?.text) || !text) return closeModal(1);

        if (!activeNote) {
            const body = { id: uuid(), date, text, groupNum };
            const { date: a, groupNum: b, ...newNote } = body;

            sendRequest("POST", body, [...notes, newNote]);
        } else {
            sendRequest("PATCH", { id: activeNote.id, text }, editNote(notes, activeNoteIndex, text));
        }
    }

    const provider = { setOpen, setActiveIndex: setActiveNoteIndex, queryState, sendRequest };

    return (
        <Modal open={!!open} onClose={() => closeModal()} className="day" process={queryState}>
            {
                open === 1 ?
                <Context.Provider value={provider}>
                    <NoteList notes={notes}/>
                    <button className={styles.addNoteBtn} onClick={() => setOpen(2)}>+</button>
                </Context.Provider> : open === 2 ?
                <>
                    <Image src="https://img.icons8.com/windows/32/return.png"
                            alt="return arrow" 
                            width={25} 
                            height={25}
                            className={styles.backArrow}
                            onClick={() => closeModal(1)}/> 
                    { activeNoteIndex >= 0 ? <h2>Заметка &#8470;{activeNoteIndex + 1}</h2> : <h2>Новая заметка</h2> }
                    <Form 
                        id={inputId}
                        className={styles.input}
                        onSubmit={sendNote}
                        process={queryState}
                        text={activeNote?.text}/>
                </> : null
            }
        </Modal>
    );
}

export default DayModal;

export const useNote = () => useContext(Context);
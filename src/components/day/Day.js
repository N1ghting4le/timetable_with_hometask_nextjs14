'use client';

import { SERVER_URL } from "@/env/env";
import Modal from "../modal/Modal";
import Subject from "../subject/Subject";
import Note from "../Note/Note";
import Btn from "../Btn/Btn";
import Image from "next/image";
import { useState, useEffect } from "react";
import { request } from "@/server/actions";
import { useDay } from "../GlobalContext";
import styles from "./day.module.css";
import { renderElements } from "@/commonFunctions";
import { v4 as uuid } from 'uuid';

const View1 = ({ noteElems, setOpen }) => (
    <>
        {noteElems}
        <div className={styles.wrapper}>
            <Btn className={styles.addNoteBtn} onClick={() => setOpen(2)}>+</Btn>
        </div>
    </>
);

const View2 = ({ elements, closeModal, activeNoteIndex, sendNote }) => (
    <>
        <Image src="https://img.icons8.com/windows/32/return.png" 
                alt="return arrow" 
                width={25} 
                height={25}
                className={styles.backArrow}
                onClick={() => closeModal(1)}/>
        { 
            activeNoteIndex >= 0 ?
            <>
                <h2>Заметка &#8470;{activeNoteIndex + 1}</h2>
                <Image src="https://img.icons8.com/color/48/full-bin-windows.png" 
                        alt="rubbish bin icon" 
                        width={30} 
                        height={30} 
                        className={styles.rubbishBin} 
                        onClick={() => sendNote(true)}/>
            </> : <h2>Новая заметка</h2> 
        }
        {elements}
    </>
);

const Day = ({ weekIndex, dayIndex }) => {
    const { date, day, subjects, notes, setNotes, editNote, deleteNote } = useDay(weekIndex, dayIndex);
    const [open, setOpen] = useState(0);
    const [process, setProcess] = useState('idle');
    const [activeNoteIndex, setActiveNoteIndex] = useState(-1);
    const url = `${SERVER_URL}/notes`;
    const inputId = "noteInput"

    useEffect(() => {
        document.documentElement.style.overflowY = open ? 'hidden' : 'auto';
    }, [open]);

    const renderSubjects = () => subjects.map((_, j) => (
        <Subject key={j}
                 weekIndex={weekIndex}
                 dayIndex={dayIndex}
                 subjectIndex={j}
                 date={date}/>
    ));

    const renderNotes = () => notes.length ? 
    notes.map((note, i) => {
        const { id, text } = note;

        return <Note key={id} i={i} text={text} setOpen={setOpen} setActiveNoteIndex={setActiveNoteIndex}/>;
    }) : <h2>Нет заметок</h2>;

    const openModal = () => setOpen(1);
    
    const closeModal = (num = 0, success = false) => {
        if (!success && process === 'sending') return;

        setOpen(num);
        setActiveNoteIndex(-1);
        setProcess('idle');
    }

    const sendNote = (toDelete = false) => {
        if (process === 'sending') return;

        const text = document.querySelector(`#${inputId}`).value;
        const activeNote = notes[activeNoteIndex];

        if ((text === activeNote?.text && !toDelete) || !text) return closeModal(1);

        const send = (method, body, newNoteList) => {
            request(url, method, JSON.stringify(body))
            .then(() => {
                setNotes(newNoteList, weekIndex, dayIndex);
                closeModal(1, true);
            })
            .catch(() => setProcess('error'));
        }

        setProcess('sending');

        if (!activeNote) {
            const body = {
                date,
                id: uuid(),
                text
            };

            send("POST", body, [...notes, body]);
        } else if (toDelete) {
            send("DELETE", { date, ...activeNote }, deleteNote(weekIndex, dayIndex, activeNoteIndex));
        } else {
            send("PATCH", { date, oldNote: activeNote, newNote: { ...activeNote, text } }, editNote(text, weekIndex, dayIndex, activeNoteIndex));
        }
    }

    const renderModal = (noteElems, elements) => {
        switch (open) {
            case 1: return <View1 noteElems={noteElems} setOpen={setOpen}/>;
            case 2: return <View2 elements={elements} closeModal={closeModal} activeNoteIndex={activeNoteIndex} sendNote={sendNote}/>;
            default: return null;
        }
    }

    const strEnd = () => {
        if (notes.length > 4 && notes.length < 21) return "ок";

        const mod = notes.length % 10;

        if (mod === 1) return "ка";
        if (mod < 5) return "ки";

        return "ок";
    }

    const subjectElems = renderSubjects();
    const noteElems = renderNotes();
    const elements = renderElements(inputId, styles.input, () => sendNote(), process, styles.error, open < 2, notes[activeNoteIndex]?.text);
    const modal = renderModal(noteElems, elements);

    return (
        <div className={`${styles.day} ${dayIndex < 3 ? styles.first : styles.second}`}>
            <p className={styles.text} onClick={openModal}>{date.split('-').reverse().slice(0, 2).join('.')}, {day}{ notes.length ? `, ${notes.length} замет${strEnd()}` : '' }</p>
            <ul className={styles.subjectList}>
                {subjectElems}
            </ul>
            <Modal open={!!open} onClose={() => closeModal()} style={open === 1 ? { paddingTop: "30px" } : null}>
                {modal}
            </Modal>
        </div>
    );
}

export default Day;
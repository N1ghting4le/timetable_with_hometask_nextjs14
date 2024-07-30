'use client';

import { SERVER_URL } from "@/env/env";
import Modal from "../modal/Modal";
import Subject from "../subject/Subject";
import Note from "../Note/Note";
import Image from "next/image";
import { useState } from "react";
import useQuery from "@/hooks/query.hook";
import { useDay, useGroupNum } from "../GlobalContext";
import styles from "./day.module.css";
import Form from "../form/Form";
import { v4 as uuid } from 'uuid';

const Day = ({ weekIndex, dayIndex }) => {
    const { date, day, subjects, notes, setNotes, editNote, deleteNote } = useDay(weekIndex, dayIndex);
    const { queryState, query, resetQueryState } = useQuery();
    const groupNum = useGroupNum(); 
    const [open, setOpen] = useState(0);
    const [activeNoteIndex, setActiveNoteIndex] = useState(-1);
    const url = `${SERVER_URL}/notes`;
    const inputId = "noteInput";
    const modalStyle = { paddingInline: '30px', maxHeight: '90vh'};

    const openModal = () => setOpen(1);
    
    const closeModal = (num = 0) => {
        if (queryState === 'pending') return;

        setOpen(num);
        setActiveNoteIndex(-1);
        resetQueryState();
    }

    const sendNote = (toDelete = false) => {
        const text = document.querySelector(`#${inputId}`).value;
        const activeNote = notes[activeNoteIndex];

        if ((text === activeNote?.text && !toDelete) || !text) return closeModal(1);

        const send = async (method, body, newNoteList) => {
            query(url, method, JSON.stringify(body))
                .then(() => {
                    setNotes(newNoteList, weekIndex, dayIndex);
                    closeModal(1);
                });
        }

        if (!activeNote) {
            const body = { id: uuid(), date, text, groupNum };
            const { date: a, groupNum: b, ...newNote } = body;

            send("POST", body, [...notes, newNote]);
        } else if (toDelete) {
            send("DELETE", { id: activeNote.id }, deleteNote(notes, activeNoteIndex));
        } else {
            send("PATCH", { id: activeNote.id, text }, editNote(notes, activeNoteIndex, text));
        }
    }

    const renderSubjects = () => subjects.map((_, j) => (
        <Subject key={j} weekIndex={weekIndex} dayIndex={dayIndex} subjectIndex={j} dayDate={date}/>
    ));

    const renderNotes = () => notes.length ? notes.map((note, i) => {
        const { id, text } = note;

        return <Note key={id} i={i} text={text} setOpen={setOpen} setActiveNoteIndex={setActiveNoteIndex}/>;
    }) : null;

    const renderModalContent = (noteElems, formProps) => {
        switch (open) {
            case 1: return <View1 noteElems={noteElems} setOpen={setOpen}/>;
            case 2: return <View2 closeModal={closeModal} activeNoteIndex={activeNoteIndex} sendNote={sendNote} formProps={formProps}/>;
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
    const modalContent = renderModalContent(noteElems, {
        id: inputId,
        className: styles.input,
        onSubmit: () => sendNote(),
        process: queryState,
        cond: open < 2,
        text: notes[activeNoteIndex]?.text
    });

    return (
        <div className={`${styles.day} ${dayIndex < 3 ? styles.first : styles.second}`}>
            <p className={styles.text} onClick={openModal}>{date.split('-').reverse().slice(0, 2).join('.')}, {day}{notes.length ? `, ${notes.length} замет${strEnd()}` : ''}</p>
            <ul className={styles.subjectList}>
                {subjectElems}
            </ul>
            <Modal open={!!open} onClose={() => closeModal()} style={modalStyle}>
                {modalContent}
            </Modal>
        </div>
    );
}

const View1 = ({ noteElems, setOpen }) => (
    <>
        {
            noteElems ? 
            <div className={styles.notes}>
                {noteElems}
            </div> : <h2>Нет заметок</h2>
        }
        <button className={styles.addNoteBtn} onClick={() => setOpen(2)}>+</button>
    </>
);

const View2 = ({ closeModal, activeNoteIndex, sendNote, formProps }) => {
    const { id, className, onSubmit, process, cond, text } = formProps;

    return (
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
            <Form id={id} className={className} onSubmit={onSubmit} process={process} cond={cond} text={text}/>
        </>
    );
}

export default Day;
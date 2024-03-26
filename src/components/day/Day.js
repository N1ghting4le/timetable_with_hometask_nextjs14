'use client';

import { SERVER_URL, HEADERS } from "@/env/env";
import Modal from "../modal/Modal";
import Subject from "../subject/Subject";
import Note from "../Note/Note";
import Btn from "../Btn/Btn";
import { useState, useEffect } from "react";
import { request } from "@/server/actions";
import styles from "./day.module.css";
import { renderElements } from "@/commonFunctions";

const Day = ({ date, day, subjects, noteItems, weekIndex, dayIndex, hometasks, setHometasks, i }) => {
    const [open, setOpen] = useState(0);
    const [notes, setNotes] = useState(noteItems);
    const [process, setProcess] = useState('idle');
    const url = `${SERVER_URL}/weekList/${weekIndex}/days/${dayIndex}/notes`;

    useEffect(() => {
        document.documentElement.style.overflowY = open ? 'hidden' : 'auto';
    }, [open]);

    const renderSubjects = () => subjects.map((item, j) => {
        const { auditories, startLessonTime, endLessonTime, numSubgroup, subject, subjectFullName, type, weekNumber, note, employees } = item;

        return <Subject key={j}
                        auditory={auditories[0]}
                        start={startLessonTime}
                        end={endLessonTime}
                        subgroup={numSubgroup}
                        subject={subjectFullName}
                        subjShort={subject}
                        type={type}
                        note={note}
                        weeks={weekNumber}
                        teacher={employees[0]}
                        weekIndex={weekIndex}
                        dayIndex={dayIndex}
                        hometask={hometasks[i][j]}
                        setHometasks={setHometasks}
                        dayI={i}
                        ind={j}/>;
    });

    const renderNotes = () => notes.length ? notes.map(note => {
        const { id, text } = note;

        return <Note key={id} id={id} text={text}/>;
    }) : <h2>Нет заметок</h2>;

    const openModal = (i) => setOpen(i);
    const closeModal = (i) => {
        if (open !== i || process === 'sending') return;

        setOpen(0);
        setProcess('idle');
    }

    const sendNote = () => {
        const text = document.querySelector("#noteInput").value;

        if (!text) {
            setOpen(0);
            return;
        }

        setProcess('sending');

        const body = {
            id: notes.length + 1,
            text
        }

        request(url, "PATCH", JSON.stringify(body), HEADERS)
        .then(() => {
            setNotes(notes => [...notes, body])
            setProcess('idle');
            setOpen(1);
        })
        .catch(() => setProcess('error'));
    }

    const strEnd = () => {
        if (notes.length > 4 && notes.length < 21) return "ок";

        const mod = notes.length % 10;

        if (mod === 1) return "ка";
        if (mod > 1 && mod < 5) return "ки";

        return "ок";
    }

    const subjectElems = renderSubjects();
    const noteElems = renderNotes();
    const elements = renderElements("noteInput", styles.input, sendNote, process, styles.error, open !== 2);

    return (
        <div className={`${styles.day} ${dayIndex < 3 ? styles.first : styles.second}`}>
            <p className={styles.text} onClick={() => openModal(1)}>{date}, {day}{ notes.length ? `, ${notes.length} замет${strEnd()}` : '' }</p>
            <ul className={styles.subjectList}>
                {subjectElems}
            </ul>
            <Modal open={open === 1} onClose={() => closeModal(1)} style={{ paddingTop: "30px" }}>
                {noteElems}
                <Btn className={styles.addNoteBtn} onClick={() => setOpen(2)}>+</Btn>
            </Modal>
            <Modal open={open === 2} onClose={() => closeModal(2)}>
                <h2>Новая заметка</h2>
                {elements}
            </Modal>
        </div>
    );
}

export default Day;
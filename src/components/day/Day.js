'use client';

import DayModal from "../dayModal/DayModal";
import Subject from "../subject/Subject";
import { useDay, useSubject } from "../GlobalContext";
import { useState } from "react";
import styles from "./day.module.css";

const Day = ({ weekIndex, dayIndex }) => {
    const { date, day, subjects, notes } = useDay(weekIndex, dayIndex);
    const [open, setOpen] = useState(0);

    const openModal = () => setOpen(1);

    const renderSubjects = () => subjects.map((subj, j) => {
        const setHometask = useSubject(weekIndex, dayIndex, j);

        return <Subject key={j} subject={subj} setHometask={setHometask} dayDate={date}/>
    });

    const strEnd = (() => {
        if (notes.length > 4 && notes.length < 21) return "ок";

        const mod = notes.length % 10;

        if (mod === 1) return "ка";
        if (mod < 5) return "ки";

        return "ок";
    })();

    const subjectElems = renderSubjects();

    return (
        <div className={`${styles.day} ${dayIndex < 3 ? styles.first : styles.second}`}>
            <p className={styles.text} onClick={openModal}>{date.split('-').reverse().slice(0, 2).join('.')}, {day}{notes.length ? `, ${notes.length} замет${strEnd}` : ''}</p>
            <ul className={styles.subjectList}>
                {subjectElems}
            </ul>
            <DayModal 
                open={open}
                setOpen={setOpen}
                notes={notes}
                date={date}
                weekIndex={weekIndex}
                dayIndex={dayIndex}/>
        </div>
    );
}

export default Day;
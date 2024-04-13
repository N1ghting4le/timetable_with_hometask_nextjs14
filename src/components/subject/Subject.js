'use client';

import Modal from "../modal/Modal";
import Image from "next/image";
import Btn from "@/components/Btn/Btn";
import { useState, useEffect } from "react";
import { PHOTO_URL, SERVER_URL } from "@/env/env";
import { request } from "@/server/actions";
import { renderElements } from "@/commonFunctions";
import { useSubgroup, useSubject } from "../GlobalContext";
import { v4 as uuid } from "uuid";
import styles from "./subject.module.css";

const Subject = ({ weekIndex, dayIndex, subjectIndex, hometask, htId, htTeacher, weekServerIndex, dayServerIndex }) => {
    const { 
        auditories, start, end, numSubgroup, subject, subjShort, type, note, weeks, employees, 
        htIndex, addHometask, editHometask, deleteHometask, getEditedHtList
    } = useSubject(weekIndex, dayIndex, subjectIndex);
    const { subgroup } = useSubgroup();
    const teacher = employees[0];
    const { firstName, middleName, lastName, photoLink } = teacher;
    const [open, setOpen] = useState(false);
    const [process, setProcess] = useState('idle');
    const auditory = auditories[0];
    const url = `${SERVER_URL}/weekList/${weekServerIndex}/days/${dayServerIndex}/hometasks`;

    useEffect(() => {
        document.documentElement.style.overflowY = open ? 'hidden' : 'auto';
    }, [open]);

    const openModal = () => setOpen(true);
    
    const closeModal = (success = false) => {
        if (process === 'sending' && !success) return;

        setOpen(false);
        setProcess('idle');
    }

    const color = () => {
        switch (type) {
            case 'ЛК': return 'green';
            case 'ПЗ': return 'yellow';
            case 'ЛР': return 'red';
        }
    }

    const startEntering = () => setProcess('entering');

    const sendHometask = () => {
        const text = document.querySelector('#hometaskInput').value;

        if (hometask === text) {
            return closeModal();
        }

        setProcess('sending');

        const changeOrDeleteHometask = action => {
            const newHtList = getEditedHtList(weekIndex, dayIndex, htIndex, text);
            const method = action === 'c' ? "PATCH" : "DELETE";
            const oldHometask = { id: htId, subject: subjShort, teacher: htTeacher, type, text: hometask };
            const body = action === 'c' ? [oldHometask, {...oldHometask, teacher, text}] : oldHometask;

            request(url, method, JSON.stringify(body))
            .then(() => {
                action === 'c' ? 
                editHometask(newHtList, weekIndex, dayIndex) :
                deleteHometask(newHtList, htIndex, weekIndex, dayIndex);
                closeModal(true);
            })
            .catch(() => setProcess('error'));
        }

        if (hometask && text) {
            changeOrDeleteHometask('c');
        } else if (hometask) {
            changeOrDeleteHometask('d');
        } else {
            const body = {
                id: uuid(),
                subject: subjShort,
                teacher,
                type,
                text 
            }

            request(url, "POST", JSON.stringify(body))
            .then(() => {
                addHometask(body, weekIndex, dayIndex, subjectIndex);
                closeModal(true);
            })
            .catch(() => setProcess('error'));
        }
    }

    const elements = renderElements("hometaskInput", styles.input, sendHometask, process, styles.error, process === 'idle', hometask);

    return subgroup === 0 || numSubgroup === 0 || numSubgroup === subgroup ? (
        <li className={styles.wrapper}>
            <div className={styles.subject} onClick={openModal}>
                <div className={styles.left}>
                    <div>
                        <p>{start}</p>
                        <p className={styles.smaller}>{end}</p>
                    </div>
                    <div className={styles.line} style={{backgroundColor: color()}}/>
                    <div className={styles.textWrapper}>
                        <p>{subjShort} ({type})</p>
                        { note ? <p>{ note.length > 16 ? `${note.substring(0, 16)}...` : note }</p> : null }
                    </div>
                </div>
                <p className={styles.htText}>{hometask}</p>
                {
                    subjShort === 'ФизК' ? null : 
                    <div className={styles.subjInfo}>
                        <p className={styles.smaller}>{lastName} {firstName[0]}.{middleName[0]}.</p>
                        <p className={styles.smaller}>{auditory}</p>
                    </div>
                }
            </div>
            <Modal open={open} onClose={closeModal}>
                <p className={`${styles.bolder} ${styles.text}`}>{subject} ({type})</p>
                <Image width={180} height={180} src={photoLink ? photoLink : PHOTO_URL} alt={`photo of ${lastName}`} className={styles.photo} style={{borderColor: color()}}/>
                <p className={styles.text}>{lastName} {firstName} {middleName}</p>
                <div className={styles.timetable}>
                    <div className={styles.timetableColumn}>
                        <span className={styles.time}>{start} - {end}</span>
                        <span className={styles.timetableItem}>{auditory}</span>
                        <span className={styles.timetableItem}>{note}</span>
                    </div>
                    <div className={styles.timetableColumn}>
                        <span className={styles.timetableItem}>{weeks.length === 4 ? '' : `нед. ${weeks.join()}`}</span>
                        <span className={styles.timetableItem}>{subgroup ? `подгр. ${subgroup}` : ''}</span>
                    </div>
                </div>
                {subjShort !== 'ФизК' ? <Btn onClick={startEntering}>Д/З</Btn> : null}
                {elements}
            </Modal>
        </li>
    ) : null;
}

export default Subject;
'use client';

import Modal from "../modal/Modal";
import Image from "next/image";
import Btn from "@/components/btn/Btn";
import { useState, useEffect } from "react";
import useQuery from "@/hooks/query.hook";
import { PHOTO_URL, SERVER_URL } from "@/env/env";
import Form from "../form/Form";
import { useSubgroup, useSubject } from "../GlobalContext";
import { v4 as uuid } from "uuid";
import styles from "./subject.module.css";

const Subject = ({ weekIndex, dayIndex, subjectIndex, dayDate }) => {
    const { 
        auditories, start, end, numSubgroup, subject, subjShort,
        type, note, weeks, employees, hometask, setHometask
    } = useSubject(weekIndex, dayIndex, subjectIndex);
    const { subgroup } = useSubgroup();
    const teacher = employees[0];
    const { firstName, middleName, lastName, photoLink } = teacher;
    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { queryState, query, resetQueryState } = useQuery();
    const auditory = auditories[0];
    const url = `${SERVER_URL}/hometasks`;
    const inputId = "hometaskInput";

    useEffect(() => {
        document.documentElement.style.overflowY = open ? 'hidden' : 'auto';
    }, [open]);

    const openModal = () => setOpen(true);
    
    const closeModal = () => {
        if (queryState === 'pending') return;

        setOpen(false);
        resetQueryState();
    }

    const color = () => {
        switch (type) {
            case 'ЛК': return 'green';
            case 'ПЗ': return 'yellow';
            case 'ЛР': return 'red';
        }
    }

    const sendHometask = () => {
        const text = document.querySelector(`#${inputId}`).value;
        const htText = hometask?.text;
        
        if (htText === text || (!htText && !text)) return closeModal();

        const send = async (method, body, newHt) => {
            query(url, method, JSON.stringify(body))
                .then(() => {
                    setHometask(weekIndex, dayIndex, subjectIndex, newHt);
                    closeModal();
                });
        }

        if (htText && text) {
            const body = { id: hometask.id, teacher, text };

            send("PATCH", body, { ...hometask, teacher, text });
        } else if (htText) {
            send("DELETE", { id: hometask.id }, null);
        } else {
            const body = { id: uuid(), date: dayDate, subject: subjShort, type, teacher, text };
            const { date, ...newHt } = body;

            send("POST", body, newHt);
        }
    }

    return subgroup === 0 || numSubgroup === 0 || numSubgroup === subgroup ? (
        <li className={styles.wrapper}>
            <div className={styles.subject} onClick={openModal}>
                <div className={styles.left}>
                    <div className={styles.time}>
                        <p>{start}</p>
                        <p className={styles.smaller}>{end}</p>
                    </div>
                    <div className={styles.line} style={{backgroundColor: color()}}/>
                    <div className={styles.textWrapper}>
                        <div className={styles.subjAndType}>
                            <p>{subjShort} ({type})</p>
                            { note ? <p>{ note.length > 16 ? `${note.substring(0, 16)}...` : note }</p> : null }
                        </div>
                        { hometask ? <p className={styles.htText}>{hometask.text}</p> : null}
                    </div>
                </div>
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
                <Image width={180} height={180} src={photoLink || PHOTO_URL} alt={`photo of ${lastName}`} className={styles.photo} style={{borderColor: color()}}/>
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
                {subjShort !== 'ФизК' ? <Btn onClick={() => setShowForm(!showForm)}>Д/З</Btn> : null}
                <Form id={inputId} onSubmit={sendHometask} process={queryState} cond={!showForm} text={hometask?.text}/>
            </Modal>
        </li>
    ) : null;
}

export default Subject;
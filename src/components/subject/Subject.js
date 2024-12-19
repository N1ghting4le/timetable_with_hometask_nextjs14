'use client';

import Modal from "../modal/Modal";
import Image from "next/image";
import { useState } from "react";
import useQuery from "@/hooks/query.hook";
import { PHOTO_URL, SERVER_URL } from "@/env/env";
import Form from "../form/Form";
import { useSubject, useGroupNum } from "../GlobalContext";
import { v4 as uuid } from "uuid";
import styles from "./subject.module.css";
import "./modal.css";

const Subject = ({ dayDate, weekIndex, dayIndex, subject }) => {
    const { 
        auditories, start, end, numSubgroup, subjName, subjShort,
        type, note, weeks, employees, hometask, color, i
    } = subject;
    const setHometask = useSubject(weekIndex, dayIndex, i);
    const groupNum = useGroupNum();
    const { id: teacherId, firstName, middleName, lastName, photoLink } = employees[0];
    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { queryState, query, resetQueryState } = useQuery();
    const auditory = auditories[0];
    const url = `${SERVER_URL}/hometasks`;
    const inputId = "hometaskInput";

    const openModal = () => setOpen(true);
    
    const closeModal = () => {
        if (queryState === 'pending') return;

        setOpen(false);
        resetQueryState();
    }

    const sendRequest = async (method, body, newHt) => {
        query(url, method, JSON.stringify(body))
            .then(() => {
                setHometask(newHt);
                closeModal();
            });
    }

    const sendHometask = () => {
        const text = document.querySelector(`#${inputId}`).value;
        const htText = hometask?.text;
        
        if (htText === text || (!htText && !text)) return closeModal();

        if (htText && text) {
            const body = { id: hometask.id, teacherId, text };

            sendRequest("PATCH", body, { ...hometask, teacherId, text });
        } else if (htText) {
            sendRequest("DELETE", { id: hometask.id }, null);
        } else {
            const body = { 
                id: uuid(),
                date: dayDate,
                subject: subjShort,
                type,
                text,
                groupNum,
                subgroup: numSubgroup,
                teacherId
            };

            const { date, groupNum: a, ...newHt } = body;

            sendRequest("POST", body, newHt);
        }
    }

    return (
        <li className={styles.wrapper}>
            <div className={styles.subject} onClick={openModal}>
                <div className={styles.left}>
                    <div className={styles.time}>
                        <p>{start}</p>
                        <p className={styles.smaller}>{end}</p>
                    </div>
                    <div className={styles.line} style={{backgroundColor: color}}/>
                    <div className={styles.textWrapper}>
                        <div className={styles.subjAndType}>
                            <p>{subjShort} ({type})</p>
                            { note ? <p>{ note.length > 16 ? `${note.substring(0, 16)}...` : note }</p> : null }
                        </div>
                        { hometask ? <p className={styles.htText}>{hometask.text}</p> : null}
                    </div>
                </div>
                <div className={styles.subjInfo}>
                    <p className={styles.smaller}>{lastName}{firstName ? ` ${firstName[0]}.` : ''}{middleName ? ` ${middleName[0]}.` : ''}</p>
                    <p className={styles.smaller}>{auditory}</p>
                </div>
            </div>
            <Modal open={open} onClose={closeModal} className="subject" process={queryState}>
                <p className={`${styles.bolder} ${styles.text}`}>{subjName} ({type})</p>
                <Image width={180} height={180} src={photoLink || PHOTO_URL} alt={`photo of ${lastName}`} className={styles.photo} style={{borderColor: color}}/>
                <p className={styles.text}>{lastName} {firstName} {middleName}</p>
                <div className={styles.timetable}>
                    <div className={styles.timetableColumn}>
                        <span className={styles.time}>{start} - {end}</span>
                        <span className={styles.timetableItem}>{auditory}</span>
                        <span className={styles.timetableItem}>{note}</span>
                    </div>
                    <div className={styles.timetableColumn}>
                        <span className={styles.timetableItem}>{weeks.length === 4 ? '' : `нед. ${weeks.join()}`}</span>
                        <span className={styles.timetableItem}>{numSubgroup ? `подгр. ${numSubgroup}` : ''}</span>
                    </div>
                </div>
                {subjShort !== 'ФизК' ? <button className={styles.button} onClick={() => setShowForm(!showForm)}>Д/З</button> : null}
                <Form id={inputId} className={styles.input} onSubmit={sendHometask} process={queryState} cond={!showForm} text={hometask?.text}/>
            </Modal>
        </li>
    );
}

export default Subject;
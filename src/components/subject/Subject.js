'use client';

import Modal from "../modal/Modal";
import Image from "next/image";
import { useState } from "react";
import useQuery from "@/hooks/query.hook";
import { PHOTO_URL, SERVER_URL } from "@/env/env";
import Form from "../form/Form";
import { useSubject, useGroupNum } from "../GlobalContext";
import { v4 as uuid } from "uuid";
import { fillFormData } from "../dayModal/DayModal";
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
    const [files, setFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState(hometask?.files || []);
    const { queryState, query, resetQueryState } = useQuery();
    const auditory = auditories[0];
    const url = `${SERVER_URL}/hometasks`;

    const openModal = () => setOpen(true);
    
    const closeModal = () => {
        if (queryState === 'pending') return;

        setOpen(false);
        resetQueryState();
    }

    const sendRequest = (method, body, newHt, headers = {}) => query(url, method, body, headers)
        .then(() => {
            setHometask(newHt);
            setFiles([]);
            setOldFiles(newHt?.files || []);
            closeModal();
        });

    const sendHometask = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");
        const htText = hometask?.text;

        if (htText == text && !files.length && oldFiles.every(file => !file.toDelete))
            return closeModal();

        if (!text && !files.length && oldFiles.every(file => file.toDelete)) {
            return sendRequest("DELETE", JSON.stringify({ id: hometask.id }), null, {
                'Content-type': 'application/json'
            });
        }

        const filesInfo = files.map(({ name }) => ({ id: uuid(), title: name }));

        if (!htText && !oldFiles.length) {
            const body = {
                id: uuid(),
                date: dayDate,
                subject: subjShort,
                type,
                groupNum,
                subgroup: numSubgroup,
                teacherId,
                filesInfo: JSON.stringify(filesInfo)
            };

            fillFormData(formData, body, files);

            const { date, groupNum: a, filesInfo: b, ...newHt } = body;

            sendRequest("POST", formData, { ...newHt, text, files: filesInfo });
        } else {
            const body = {
                id: hometask.id,
                teacherId,
                filesInfo: JSON.stringify(filesInfo),
                deletedFilesIds: JSON.stringify(oldFiles.filter(file => file.toDelete).map(({ id }) => id))
            };

            fillFormData(formData, body, files);

            sendRequest("PATCH", formData, {
                ...hometask,
                teacherId,
                text,
                files: [...oldFiles.filter(file => !file.toDelete), ...filesInfo]
            });
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
                    <div>
                        <div className={styles.subjAndType}>
                            <p>{subjShort} ({type})</p>
                            {note && <p>{ note.length > 16 ? `${note.substring(0, 16)}...` : note }</p>}
                        </div>
                        {hometask && <p className={styles.htText}>{hometask.text}</p>}
                        {oldFiles.length ? <p className={styles.fileText}>Есть прикреплённые файлы</p> : null}
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
                {subjShort !== 'ФизК' && <button className={styles.button} onClick={() => setShowForm(!showForm)}>Д/З</button>}
                <Form
                    className={styles.input}
                    onSubmit={sendHometask}
                    process={queryState}
                    cond={!showForm}
                    text={hometask?.text}
                    oldFiles={oldFiles}
                    setOldFiles={setOldFiles}
                    files={files}
                    setFiles={setFiles}/>
            </Modal>
        </li>
    );
}

export default Subject;
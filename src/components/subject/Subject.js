'use client';

import Popup from "reactjs-popup";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { PHOTO_URL, SERVER_URL, HEADERS } from "@/env/env";
import { request } from "@/server/actions";
import { SubgroupContext } from "../weekList/WeekList";
import { useContext } from "react";
import styles from "./subject.module.css";
import "./popup.css";

const Subject = ({ auditory, start, end, subgroup, subject, subjShort, type, note, weeks, teacher, weekIndex, dayIndex, hometask, setHometasks, dayI, ind }) => {
    const [open, setOpen] = useState(false);
    const [process, setProcess] = useState('idle');
    const [hometaskText, setHometaskText] = useState(hometask);
    const { firstName, middleName, lastName, photoLink } = teacher;
    const subgroupNum = useContext(SubgroupContext);

    useEffect(() => {
        document.documentElement.style.overflowY = open ? 'hidden' : 'auto';
    }, [open]);

    useEffect(() => {
        if (process === 'entering') {
            const input = document.querySelector('#hometaskInput');

            input.value = hometaskText;
            input.focus();
        }
    }, [process]);

    const openModal = () => setOpen(true);
    
    const closeModal = () => {
        if (process === 'sending') return;

        setOpen(false);
        setProcess('idle');
    }

    const color = useMemo(() => {
        switch (type) {
            case 'ЛК': return 'green';
            case 'ПЗ': return 'yellow';
            case 'ЛР': return 'red';
        }
    }, [type]);

    const startEntering = () => setProcess('entering');

    const sendHometask = async () => {
        const text = document.querySelector('#hometaskInput').value;

        if (hometaskText === text) {
            setProcess('idle');
            closeModal();
            return;
        }

        setProcess('sending');

        const url = `${SERVER_URL}/weekList/${weekIndex}/days/${dayIndex}/hometasks`;

        const finishSending = () => {
            setHometaskText(text);
            setHometasks(hometasks => hometasks.map((item, i) => i === dayI ? item.map((task, i) => i === ind ? text : task) : item));
            setProcess('idle');
            closeModal();
        }

        const changeOrDeleteHometask = async action => {
            const oldHtList = await request(url, "GET", null, HEADERS);

            if (oldHtList && oldHtList.length) {
                const newHtList = action === 'change' ? 
                oldHtList.map(ht => ht.subject === subjShort && (subjShort === 'ИнЯз' ? JSON.stringify(ht.teacher) === JSON.stringify(teacher) : true) ? { ...ht, text } : ht) :
                oldHtList.filter(ht => ht.subject !== subjShort || (subjShort === 'ИнЯз' ? JSON.stringify(ht.teacher) !== JSON.stringify(teacher) : false));

                request(url, "POST", JSON.stringify(newHtList), HEADERS).then(finishSending).catch(() => setProcess('error'));
            } else {
                setProcess('error');
            }
        }

        if (hometaskText && text) {
            await changeOrDeleteHometask('change');
        } else if (hometaskText) {
            await changeOrDeleteHometask('delete');
        } else if (text) {
            const body = {
                subject: subjShort,
                teacher,
                type,
                text 
            }

            request(url, "PATCH", JSON.stringify(body), HEADERS).then(finishSending).catch(() => setProcess('error'));
        }
    }

    const sendHometaskByEnter = (e) => e.code === 'Enter' ? sendHometask() : null;

    const renderElements = () => {
        if (subjShort === 'ФизК' || process === 'idle') return null;

        return (
            <>
                <textarea id="hometaskInput" type="text" className={styles.input} onKeyDown={sendHometaskByEnter}/>
                {
                    process === 'sending' ? <p>Отправка...</p> :
                    <>
                        <button className={`${styles.button} ${styles.hoverAnimation}`} onClick={sendHometask}>Подтвердить</button>
                        {
                            process === 'error' ? <p className={styles.error}>Произошла ошибка (разрабы дауны)</p> : null
                        }
                    </>
                }
            </>
        );
    }

    const elements = renderElements();

    return subgroup === 0 || subgroupNum === 0 || subgroupNum === subgroup ? (
        <li className={styles.wrapper}>
            <div className={`${styles.subject} ${styles.hoverAnimation}`} onClick={openModal}>
                <div className={styles.left}>
                    <div>
                        <p>{start}</p>
                        <p className={styles.smaller}>{end}</p>
                    </div>
                    <div className={styles.line} style={{backgroundColor: color}}/>
                    <p>{subjShort} ({type})<br/>{note}</p>
                </div>
                <p className={styles.htText}>{hometaskText}</p>
                {
                    subjShort === 'ФизК' ? null : 
                    <div className={styles.subjInfo}>
                        <p className={styles.smaller}>{lastName} {firstName[0]}.{middleName[0]}.</p>
                        <p className={styles.smaller}>{auditory}</p>
                    </div>
                }
            </div>
            <Popup modal open={open} onClose={closeModal}>
                <div className={styles.closeModal} onClick={closeModal}/>
                <p className={`${styles.bolder} ${styles.text}`}>{subject} ({type})</p>
                <Image width={180} height={180} src={photoLink ? photoLink : PHOTO_URL} alt={`photo of ${lastName}`} className={styles.photo} style={{borderColor: color}}/>
                <p className={styles.text}>{lastName} {firstName} {middleName}</p>
                <div className={styles.timetable}>
                    <div className={styles.timetableColumn}>
                        <span className={styles.time}>{start} - {end}</span>
                        <span className={styles.timetableItem}>{auditory}</span>
                        { note ? <span className={styles.timetableItem}>{note}</span> : null }
                    </div>
                    <div className={styles.timetableColumn}>
                        <span className={styles.timetableItem}>{weeks.length === 4 ? '' : `нед. ${weeks.join()}`}</span>
                        <span className={styles.timetableItem}>{subgroup ? `подгр. ${subgroup}` : ''}</span>
                    </div>
                </div>
                {subjShort !== 'ФизК' ? <button className={`${styles.button} ${styles.hoverAnimation}`} onClick={startEntering}>Д/З</button> : null}
                {elements}
            </Popup>
        </li>
    ) : null;
}

export default Subject;
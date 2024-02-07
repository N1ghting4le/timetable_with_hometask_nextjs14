'use client';

import { useState, useEffect, useRef } from "react";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex, weekNum, days, curr, isDesktop }) => {
    const [prevCurr, setPrevCurr] = useState(curr);
    const [isCurr, setIsCurr] = useState(curr === weekIndex);
    const [side, setSide] = useState('');
    const [hometasks, setHometasks] = useState(days.map(item => item.subjects.map((item => item.hometask))));
    const ref = useRef({});

    useEffect(() => {
        if (curr === weekIndex) {
            setSide(() => {
                if (prevCurr > weekIndex) return styles.fromLeft;
                return prevCurr < weekIndex ? styles.fromRight : null;
            });
            setIsCurr(true);
        } else if (prevCurr === weekIndex) {
            if (isDesktop) {
                setTimeout(() => {
                    setIsCurr(false);
                }, 300);
    
                ref.current.style.transform = curr > weekIndex ? "translateX(-100%)" : "translateX(100%)";
            } else {
                setIsCurr(false);
            }
        }

        setPrevCurr(curr);
    }, [curr]);

    const renderDays = () => days.map((item, i) => {
        const { date, day, subjects, dayNum } = item;

        return <Day key={date} date={date} day={day} subjects={subjects} weekIndex={weekNum} dayIndex={dayNum} hometasks={hometasks} setHometasks={setHometasks} i={i}/>;
    });

    const elements = renderDays();

    return isCurr ? (
        <div className={`${styles.week} ${side}`} ref={el => ref.current = el}>
            {elements}
        </div>
    ) : null;
}

export default Week;
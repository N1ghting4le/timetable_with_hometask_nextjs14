'use client';

import { useState, useEffect, useRef } from "react";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex, weekNum, days, curr, prevCurr, isDesktop }) => {
    const [display, setDisplay] = useState(curr === weekIndex);
    const [side, setSide] = useState(null);
    const [hometasks, setHometasks] = useState(days.map(item => item.subjects.map((item => item.hometask))));
    const ref = useRef({});

    useEffect(() => {
        if (curr === weekIndex) {
            setDisplay(true);
            setSide(() => {
                if (prevCurr > weekIndex) return styles.fromLeft;
                return prevCurr < weekIndex ? styles.fromRight : null;
            });
        } else if (display) {
            if (isDesktop) {
                setTimeout(() => {
                    setDisplay(false);
                }, 300);
    
                ref.current.style.transform = curr > weekIndex ? "translateX(-100%)" : "translateX(100%)";
            } else {
                setDisplay(false);
            }
        }
    }, [curr]);

    const renderDays = () => days.map((item, i) => {
        const { date, day, subjects, dayNum, notes } = item;

        return <Day key={date} date={date} day={day} subjects={subjects} noteItems={notes} weekIndex={weekNum} dayIndex={dayNum} hometasks={hometasks} setHometasks={setHometasks} i={i}/>;
    });

    const elements = renderDays();

    return display ? (
        <div className={`${styles.week} ${side}`} ref={el => ref.current = el}>
            {elements}
        </div>
    ) : null;
}

export default Week;
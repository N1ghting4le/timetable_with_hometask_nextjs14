'use client';

import { useState, useEffect, useRef } from "react";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex, prev, curr, days }) => {
    const [display, setDisplay] = useState(curr === weekIndex);
    const ref = useRef(null);
    const timeoutRef = useRef(null);

    const clear = (display = false) => {
        const id = timeoutRef.current;

        if (id) {
            clearTimeout(id);
            timeoutRef.current = null;
        }

        setDisplay(display);
    }

    useEffect(() => {
        if (curr === weekIndex) {
            clear(true);
        } else if (prev === weekIndex) {
            timeoutRef.current = setTimeout(() => setDisplay(false), 300);
            ref.current.classList.add(styles[curr > weekIndex ? 'toLeft' : 'toRight']);
        } else if (display) {
            clear();
        }
    }, [curr]);

    const animation = (() => {
        if (prev === weekIndex) return '';

        return styles[prev < weekIndex ? 'fromRight' : 'fromLeft'];
    })();

    const renderDays = () => days.map((day, i) => (
        <Day
            key={day.date}
            weekIndex={weekIndex}
            dayIndex={i}
            dayObj={day}
        />));

    const elements = renderDays();

    return display ? (
        <div className={`${styles.week} ${animation}`} ref={ref}>
            {elements}
        </div>
    ) : null;
}

export default Week;
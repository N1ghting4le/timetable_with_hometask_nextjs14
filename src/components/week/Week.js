'use client';

import { useState, useEffect, useRef } from "react";
import { useCurr, useWeek } from "../GlobalContext";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex }) => {
    const { curr, prevCurr } = useCurr();
    const { days } = useWeek(weekIndex);
    const [display, setDisplay] = useState(curr === weekIndex);
    const [animation, setAnimation] = useState(null);
    const ref = useRef({});

    useEffect(() => {
        if (curr === weekIndex) {
            setDisplay(true);
            setAnimation(() => {
                if (prevCurr === weekIndex) return null;
                return styles[prevCurr < weekIndex ? 'fromRight' : 'fromLeft'];
            });
        } else if (display) {
            setTimeout(() => setDisplay(false), 300);
            
            ref.current.style.position = 'absolute';
            ref.current.style.transform = `translateX(${curr > weekIndex ? -100 : 100}%)`;
        }
    }, [curr]);

    const renderDays = () => days.map((item, i) => (
        <Day key={item.date}
             weekIndex={weekIndex}
             dayIndex={i}/>
    ));

    const elements = renderDays();

    return display ? (
        <div className={`${styles.week} ${animation}`} ref={el => ref.current = el}>
            {elements}
        </div>
    ) : null;
}

export default Week;
'use client';

import { useState, useEffect, useRef } from "react";
import { useCurr, useWeek } from "../GlobalContext";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex }) => {
    const { prev, curr } = useCurr();
    const { days } = useWeek(weekIndex);
    const [display, setDisplay] = useState(curr === weekIndex);
    const ref = useRef({});

    useEffect(() => {
        if (curr === weekIndex) {
            setDisplay(true);
        } else if (prev === weekIndex) {
            setTimeout(() => setDisplay(false), 300);
            
            ref.current.style.position = 'absolute';
            ref.current.style.transform = `translateX(${curr > weekIndex ? -100 : 100}%)`;
        } else if (display) {
            setDisplay(false);
        }
    }, [curr]);

    const chooseAnimation = () => {
        if (prev === weekIndex) return '';

        return styles[prev < weekIndex ? 'fromRight' : 'fromLeft'];
    }

    const renderDays = () => days.map((item, i) => (
        <Day key={item.date}
             weekIndex={weekIndex}
             dayIndex={i}/>
    ));

    const elements = renderDays();

    return display ? (
        <div className={`${styles.week} ${chooseAnimation()}`} ref={ref}>
            {elements}
        </div>
    ) : null;
}

export default Week;
'use client';

import { useState, useEffect, useRef } from "react";
import { useIsDesktop, useCurr, useWeek } from "../GlobalContext";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex }) => {
    const { curr, prevCurr } = useCurr();
    const { days } = useWeek(weekIndex);
    const isDesktop = useIsDesktop();
    const [display, setDisplay] = useState(curr === weekIndex);
    const [side, setSide] = useState(null);
    const ref = useRef({});

    useEffect(() => {
        if (curr === weekIndex) {
            setDisplay(true);
            setSide(() => {
                if (prevCurr > weekIndex) return styles.fromLeft;
                return prevCurr < weekIndex ? styles.fromRight : null;
            });
        } else if (display) {
            if (!isDesktop) return setDisplay(false);

            setTimeout(() => setDisplay(false), 300);
    
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
        <div className={`${styles.week} ${side}`} ref={el => ref.current = el}>
            {elements}
        </div>
    ) : null;
}

export default Week;
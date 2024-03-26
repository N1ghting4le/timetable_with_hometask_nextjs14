'use client';

import { useState, useEffect, useRef } from "react";
import { useIsDesktop, useCurr, useWeek } from "../GlobalContext";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex }) => {
    const { curr, prevCurr } = useCurr();
    const { days, weekNum } = useWeek(weekIndex);
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
        return <Day key={item.date}
                    weekIndex={weekIndex}
                    weekServerIndex={weekNum} 
                    dayServerIndex={item.dayNum} 
                    dayIndex={i}/>;
    });

    const elements = renderDays();

    return display ? (
        <div className={`${styles.week} ${side}`} ref={el => ref.current = el}>
            {elements}
        </div>
    ) : null;
}

export default Week;
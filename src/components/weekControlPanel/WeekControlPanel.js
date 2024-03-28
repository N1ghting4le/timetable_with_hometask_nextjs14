'use client';

import { useCurr, useSubgroup } from '../GlobalContext';
import styles from './weekControlPanel.module.css';

const WeekControlPanel = ({ limit }) => {
    const { curr, setCurr } = useCurr();
    const { subgroup, setSubgroup } = useSubgroup();
    const moveToNext = () => setCurr(curr + 1);
    const moveToPrev = () => setCurr(curr - 1);
    const changeSubgroup = (e) => setSubgroup(+e.target.dataset.subgr);
    const isActive = num => subgroup === num ? { backgroundColor: 'black' } : null;
    const btnNames = ["Общее", "1 Подгруппа", "2 Подгруппа"];
    const hidden = { opacity: 0, cursor: "default" };

    const btns = btnNames.map((item, i) => (
        <button key={i} className={`${styles.buttonStyle} ${styles.subgrButt}`} 
                data-subgr={i} onClick={changeSubgroup} style={isActive(i)}>{item}</button>
    ));
    
    return (
        <div className={styles.wrapper}>
            <button className={`${styles.buttonStyle} ${styles.arrow} ${styles.prev}`}
                    disabled={!curr} 
                    style={!curr ? hidden : null} 
                    onClick={moveToPrev}>Пред. неделя</button>
            <div className={styles.buttons}>
                {btns}
            </div>
            <button className={`${styles.buttonStyle} ${styles.arrow} ${styles.next}`}
                    disabled={curr === limit} 
                    style={curr === limit ? hidden : null} 
                    onClick={moveToNext}>След. неделя</button>
        </div>
    );
}

export default WeekControlPanel;
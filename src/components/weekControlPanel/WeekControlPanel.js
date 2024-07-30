'use client';

import { useCurr, useSubgroup } from '../GlobalContext';
import Link from 'next/link';
import HomeIcon from '../HomeIcon';
import SavedGroupsModal from '../savedGroupsModal/SavedGroupsModal';
import styles from './weekControlPanel.module.css';

const WeekControlPanel = ({ limit }) => {
    const { curr, setCurr } = useCurr();
    const { subgroup, setSubgroup } = useSubgroup();
    const btnNames = ["Общ.", "1 Подгр.", "2 Подгр."];
    const hidden = { opacity: 0, cursor: "default" };

    const moveToNext = () => setCurr(curr + 1);
    const moveToPrev = () => setCurr(curr - 1);
    const changeSubgroup = (e) => setSubgroup(+e.target.dataset.subgr);
    const isActive = num => subgroup === num ? styles.active : '';

    const btns = btnNames.map((item, i) => (
        <button key={i} className={`${styles.buttonStyle} ${isActive(i)}`} 
                data-subgr={i} onClick={changeSubgroup}>{item}</button>
    ));
    
    return (
        <div className={styles.wrapper}>
            <button className={`${styles.buttonStyle} ${styles.arrow} ${styles.prev}`}
                    disabled={!curr} 
                    style={!curr ? hidden : null} 
                    onClick={moveToPrev}>Пред. неделя</button>
            <div className={styles.buttons}>
                <Link href='/' className={styles.link}><HomeIcon width={20}/></Link>
                <SavedGroupsModal buttonClass={styles.buttonStyle}/>
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
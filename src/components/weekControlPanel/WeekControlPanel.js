import styles from './weekControlPanel.module.css';

const WeekControlPanel = ({ limit, subgroup, setSubgroup, curr, setCurr }) => {
    const moveToNext = () => setCurr(curr => curr + 1);
    const moveToPrev = () => setCurr(curr => curr - 1);
    const changeSubgroup = (e) => setSubgroup(+e.target.dataset.subgr);
    const isActive = num => subgroup === num ? { backgroundColor: 'black' } : null;
    
    return (
        <div className={styles.wrapper}>
            <button className={`${styles.buttonStyle} ${styles.arrow} ${styles.prev}`}
                    disabled={!curr} 
                    style={!curr ? { opacity: 0, cursor: "default" } : null} 
                    onClick={moveToPrev}>Пред. неделя</button>
            <div className={styles.buttons}>
                <button className={`${styles.buttonStyle} ${styles.subgrButt}`} data-subgr='0' onClick={changeSubgroup} style={isActive(0)}>Общее</button>
                <button className={`${styles.buttonStyle} ${styles.subgrButt}`} data-subgr='1' onClick={changeSubgroup} style={isActive(1)}>1 Подгруппа</button>
                <button className={`${styles.buttonStyle} ${styles.subgrButt}`} data-subgr='2' onClick={changeSubgroup} style={isActive(2)}>2 Подгруппа</button>
            </div>
            <button className={`${styles.buttonStyle} ${styles.arrow} ${styles.next}`}
                    disabled={curr === limit} 
                    style={curr === limit ? { opacity: 0, cursor: "default"} : null} 
                    onClick={moveToNext}>След. неделя</button>
        </div>
    );
}

export default WeekControlPanel;
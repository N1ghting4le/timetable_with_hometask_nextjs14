'use client';

import WeekControlPanel from "../weekControlPanel/WeekControlPanel";
import Week from "../week/Week";
import Loading from "../loading/Loading";
import { useWeekList } from "../GlobalContext";
import styles from "./weekList.module.css";

const WeekList = () => {
    const weekList = useWeekList();

    const renderWeeks = () => weekList.length ? 
        weekList.map((_, i) => <Week key={i} weekIndex={i}/>) : <Loading/>;

    const elements = renderWeeks();
    
    return (
        <div className={styles.weekWrapper}>
            <WeekControlPanel limit={weekList.length - 1}/>
            <div className={styles.weeks}>
                {elements}
            </div>
        </div>
    );
}

export default WeekList;
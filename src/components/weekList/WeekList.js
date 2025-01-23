'use client';

import WeekControlPanel from "../weekControlPanel/WeekControlPanel";
import Week from "../week/Week";
import { useWeekList } from "../GlobalContext";
import styles from "./weekList.module.css";

const WeekList = () => {
    const weekList = useWeekList();

    const renderWeeks = () => weekList.length ?
        weekList.map((_, i) => <Week key={i} weekIndex={i}/>) :
        <p className={styles.msg}>Расписание не составлено</p>;

    const elements = renderWeeks();

    return (
        <main className={styles.weekWrapper}>
            <WeekControlPanel limit={weekList.length - 1}/>
            <div className={styles.weeks}>
                {elements}
            </div>
        </main>
    );
}

export default WeekList;
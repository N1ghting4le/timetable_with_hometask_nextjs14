'use client';

import WeekControlPanel from "../weekControlPanel/WeekControlPanel";
import Week from "../week/Week";
import Loading from "../loading/Loading";
import Error from "@/app/error";
import { useWeekList, useLoadingState } from "../GlobalContext";
import styles from "./weekList.module.css";

const WeekList = () => {
    const { isLoading, isError } = useLoadingState();
    const weekList = useWeekList();
    
    if (isLoading) return <Loading/>;
    if (isError) return <Error/>;

    const renderWeeks = () => weekList.length ?
        weekList.map((_, i) => <Week key={i} weekIndex={i}/>) :
        <p className={styles.msg}>Дауны на методистах не составили расписание</p>;

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
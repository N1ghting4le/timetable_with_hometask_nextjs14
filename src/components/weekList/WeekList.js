'use client';

import { LOCAL_STORAGE_GROUP_NUM } from "@/env/env";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWeekList } from "@/store/slices/weekListSlice";
import getTimetable from '@/server/actions';
import WeekControlPanel from "../weekControlPanel/WeekControlPanel";
import Week from "../week/Week";
import Loading from "../loading/Loading";
import Error from "@/app/error";
import styles from "./weekList.module.css";

const WeekList = ({ groupNum }) => {
    const { weekList, prev, curr } = useSelector(state => state.weekList);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        getTimetable(groupNum)
            .then(res => {
                const { weekList, currWeekIndex: curr } = res;

                localStorage.setItem(LOCAL_STORAGE_GROUP_NUM, groupNum);
                dispatch(setWeekList({ weekList, curr, groupNum }));
            })
            .catch(err => {
                console.error(err);
                setIsError(true);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const renderWeeks = () => weekList.length ?
        weekList.map(({ days }, i) =>
            <Week
                key={i}
                weekIndex={i}
                prev={prev}
                curr={curr}
                days={days}
            />) : <p className={styles.msg}>Расписание не составлено</p>;

    if (isLoading) return <Loading/>;
    if (isError) return <Error/>;

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
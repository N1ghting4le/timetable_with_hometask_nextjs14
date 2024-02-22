'use client';

import WeekControlPanel from "../weekControlPanel/WeekControlPanel";
import Week from "../week/Week";
import Loading from "../loading/Loading";
import { useState, useEffect, createContext } from "react";
import styles from "./weekList.module.css";
import getTimetable from '@/server/actions';
import MobileDetect from "mobile-detect";

export const SubgroupContext = createContext(0);

const WeekList = () => {
    const [subgroup, setSubgroup] = useState(0);
    const [curr, setCurr] = useState(-2);
    const [prevCurr, setPrevCurr] = useState(-2);
    const [weekList, setWeekList] = useState([]);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const md = new MobileDetect(navigator.userAgent);

        setIsDesktop(!md.mobile());

        (async () => {
            const { weekList, currWeekIndex } = await getTimetable();

            setCurr(currWeekIndex);
            setPrevCurr(currWeekIndex);
            setWeekList(weekList);
        })();
    }, []);

    const renderWeeks = () => weekList.length ? weekList.map((week, i) => <Week key={i} 
                                                                                weekIndex={i} 
                                                                                weekNum={week.weekNum} 
                                                                                days={week.days} 
                                                                                curr={curr} 
                                                                                prevCurr={prevCurr} 
                                                                                isDesktop={isDesktop}/>) : <Loading/>;

    const elements = renderWeeks();
    
    return (
        <div className={styles.weekWrapper}>
            <WeekControlPanel limit={weekList.length - 1}
                              subgroup={subgroup} 
                              setSubgroup={setSubgroup}
                              curr={curr}
                              setCurr={setCurr}
                              setPrevCurr={setPrevCurr}/>
            <div className={styles.weeks}>
                <SubgroupContext.Provider value={subgroup}>
                    {elements}
                </SubgroupContext.Provider>
            </div>
        </div>
    );
}

export default WeekList;
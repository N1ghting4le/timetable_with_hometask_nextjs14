'use client';

import { createContext, useContext, useState, useEffect } from "react";
import Error from "@/app/error";
import MobileDetect from "mobile-detect";
import getTimetable from '@/server/actions';

const Context = createContext(null);

const GlobalContext = ({ groupNum, children }) => {
    const [isError, setIsError] = useState(false);
    const [globalState, setGlobalState] = useState({
        subgroup: 0,
        curr: -2,
        prevCurr: -2,
        weekList: [],
        groupNum,
        isDesktop: false
    });

    useEffect(() => {
        getTimetable(groupNum)
            .then(res => {
                const { weekList, currWeekIndex: curr } = res;
                const md = new MobileDetect(navigator.userAgent);

                setGlobalState(state => ({
                    ...state,  
                    curr, 
                    prevCurr: curr,
                    weekList,
                    isDesktop: !md.mobile()
                }));
            })
            .catch(err => {
                console.error(err);
                setIsError(true);
            });
    }, []);

    const provider = {
        weekList: globalState.weekList,
        subgroup: globalState.subgroup,
        curr: globalState.curr,
        prevCurr: globalState.prevCurr,
        groupNum: globalState.groupNum,
        isDesktop: globalState.isDesktop,

        setSubgroup(subgroup) {
            setGlobalState(state => ({...state, subgroup}));
        },

        setCurr(curr) {
            setGlobalState(state => ({...state, prevCurr: state.curr, curr}));
        },

        setNotes(newNoteList, weekIndex, dayIndex) {
            const weekList = globalState.weekList;

            weekList[weekIndex].days[dayIndex].notes = newNoteList;
            setGlobalState(state => ({...state, weekList}));
        },

        deleteNote(notes, noteIndex) {
            return notes.filter((_, i) => i !== noteIndex);
        },

        editNote(notes, noteIndex, text) {
            return notes.map((note, i) => i === noteIndex ? ({...note, text}) : note);
        },

        setHometask(weekIndex, dayIndex, subjectIndex, newHometask) {
            const weekList = globalState.weekList;

            weekList[weekIndex].days[dayIndex].subjects[subjectIndex].hometask = newHometask;
            setGlobalState(state => ({...state, weekList}));
        }
    }

    return isError ? <Error/> : (
        <Context.Provider value={provider}>
            {children}
        </Context.Provider>
    );
}

export default GlobalContext;

const useWeekList = () => useContext(Context).weekList;
const useGroupNum = () => useContext(Context).groupNum;
const useIsDesktop = () => useContext(Context).isDesktop;
const useWeek = (weekIndex) => useWeekList()[weekIndex];

const useDay = (weekIndex, dayIndex) => {
    const day = useWeek(weekIndex).days[dayIndex],
          context = useContext(Context),
        { setNotes, editNote, deleteNote } = context;

    return { ...day, setNotes, editNote, deleteNote };
}

const useSubject = (weekIndex, dayIndex, subjectIndex) => {
    const subject = useDay(weekIndex, dayIndex).subjects[subjectIndex],
          context = useContext(Context),
        { setHometask } = context;

    return { ...subject, setHometask };
}

const useCurr = () => {
    const context = useContext(Context),
        { curr, prevCurr, setCurr } = context;

    return { curr, prevCurr, setCurr };
}

const useSubgroup = () => {
    const context = useContext(Context),
        { subgroup, setSubgroup } = context;

    return { subgroup, setSubgroup };
}

export {
    useWeekList,
    useGroupNum,
    useIsDesktop,
    useCurr,
    useSubgroup,
    useWeek,
    useDay,
    useSubject
};
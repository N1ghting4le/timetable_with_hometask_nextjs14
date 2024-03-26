'use client';

import { createContext, useContext, useState, useLayoutEffect } from "react";
import MobileDetect from "mobile-detect";
import getTimetable from '@/server/actions';

const Context = createContext(null);

const GlobalContext = ({ children }) => {
    const [globalState, setGlobalState] = useState({
        subgroup: 0,
        curr: -2,
        prevCurr: -2,
        weekList: [],
        isDesktop: false
    });

    useLayoutEffect(() => {
        getTimetable()
        .then(res => {
            const { weekList, currWeekIndex: curr } = res;

            setGlobalState(state => ({...state, weekList, curr, prevCurr: curr}));
        })
        .catch(() => {
            throw new Error("Could not fetch nessessary data");
        });

        const md = new MobileDetect(navigator.userAgent);

        setGlobalState(state => ({...state, isDesktop: !md.mobile()}));
    }, []);

    const provider = {
        weekList: globalState.weekList,
        subgroup: globalState.subgroup,
        curr: globalState.curr,
        prevCurr: globalState.prevCurr,
        isDesktop: globalState.isDesktop,

        setWeekList(weekList) {
            setGlobalState(state => ({...state, weekList}));
        },

        setSubgroup(subgroup) {
            setGlobalState(state => ({...state, subgroup}));
        },

        setCurr(curr) {
            setGlobalState(state => ({...state, prevCurr: state.curr, curr}));
        },

        setHometask(text, weekIndex, dayIndex, subjIndex) {
            const weekList = [...globalState.weekList];

            weekList[weekIndex].days[dayIndex].subjects[subjIndex].hometask = text;
            setGlobalState(state => ({...state, weekList}));
        },

        setNotes(newNoteList, weekIndex, dayIndex) {
            const weekList = [...globalState.weekList];

            weekList[weekIndex].days[dayIndex].notes = newNoteList;
            setGlobalState(state => ({...state, weekList}));
        },

        deleteNote(weekIndex, dayIndex, noteIndex) {
            return globalState.weekList[weekIndex].days[dayIndex].notes
                    .filter((_, i) => i !== noteIndex)
                    .map((note, i) => ({...note, id: i + 1}));
        },

        editNote(text, weekIndex, dayIndex, noteIndex) {
            return globalState.weekList[weekIndex].days[dayIndex].notes
                    .map((note, i) => i === noteIndex ? ({...note, text}) : note);
        }
    }

    return (
        <Context.Provider value={provider}>
            {children}
        </Context.Provider>
    );
}

export default GlobalContext;

const useWeekList = () => useContext(Context).weekList;
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
          setHometask = useContext(Context).setHometask;

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
    useIsDesktop,
    useCurr,
    useSubgroup,
    useWeek,
    useDay,
    useSubject
};
'use client';

import { createContext, useContext, useState, useEffect } from "react";
import Error from "@/app/error";
import getTimetable from '@/server/actions';

const Context = createContext(null);

const GlobalContext = ({ groupNum, children }) => {
    const [isError, setIsError] = useState(false);
    const [globalState, setGlobalState] = useState({
        subgroup: 0,
        prev: -1,
        curr: -1,
        weekList: [],
        groupNum
    });

    useEffect(() => {
        getTimetable(groupNum)
            .then(res => {
                const { weekList, currWeekIndex: curr } = res;

                setGlobalState(state => ({
                    ...state,
                    prev: curr,
                    curr,
                    weekList
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
        prev: globalState.prev,
        curr: globalState.curr,
        groupNum: globalState.groupNum,

        setSubgroup(subgroup) {
            setGlobalState(state => ({...state, subgroup}));
        },

        setCurr(curr) {
            setGlobalState(state => ({...state, prev: state.curr, curr}));
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
        { prev, curr, setCurr } = context;

    return { prev, curr, setCurr };
}

const useSubgroup = () => {
    const context = useContext(Context),
        { subgroup, setSubgroup } = context;

    return { subgroup, setSubgroup };
}

export {
    useWeekList,
    useGroupNum,
    useCurr,
    useSubgroup,
    useWeek,
    useDay,
    useSubject
};
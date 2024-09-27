'use client';

import { LOCAL_STORAGE_GROUP_NUM } from "@/env/env";
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

                localStorage.setItem(LOCAL_STORAGE_GROUP_NUM, groupNum);

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

        setSubgroup: (subgroup) => setGlobalState(state => ({...state, subgroup})),
        setCurr: (curr) => setGlobalState(state => ({...state, prev: state.curr, curr})),

        createHometaskSetter: (weekIndex, dayIndex, subjectIndex) => (newHometask) => {
            const weekList = globalState.weekList;

            weekList[weekIndex].days[dayIndex].subjects[subjectIndex].hometask = newHometask;
            setGlobalState(state => ({...state, weekList}));
        },

        createNotesSetter: (weekIndex, dayIndex) => (newNoteList) => {
            const weekList = globalState.weekList;

            weekList[weekIndex].days[dayIndex].notes = newNoteList;
            setGlobalState(state => ({...state, weekList}));
        },

        deleteNote: (notes, noteIndex) => notes.filter((_, i) => i !== noteIndex),
        editNote: (notes, noteIndex, text) => 
            notes.map((note, i) => i === noteIndex ? ({...note, text}) : note),
    };

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
const useDay = (weekIndex, dayIndex) => useWeek(weekIndex).days[dayIndex];
const useSubject = (weekIndex, dayIndex, subjectIndex) => 
    useContext(Context).createHometaskSetter(weekIndex, dayIndex, subjectIndex);

const useNotes = (weekIndex, dayIndex) => {
    const context = useContext(Context),
        { createNotesSetter, editNote, deleteNote } = context;

    return { setNotes: createNotesSetter(weekIndex, dayIndex), editNote, deleteNote };
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
    useNotes,
    useSubject
};
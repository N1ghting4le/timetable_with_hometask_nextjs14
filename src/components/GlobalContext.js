'use client';

import { LOCAL_STORAGE_GROUP_NUM } from "@/env/env";
import { createContext, useContext, useState, useEffect } from "react";
import getTimetable from '@/server/actions';

const Context = createContext(null);

const GlobalContext = ({ groupNum, children }) => {
    const [globalState, setGlobalState] = useState({
        subgroup: 0,
        prev: -1,
        curr: -1,
        weekList: [],
        groupNum,
        isLoading: true,
        isError: false
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
                    weekList,
                    isLoading: false
                }));
            })
            .catch(err => {
                console.error(err);
                setGlobalState(state => ({ ...state, isLoading: false, isError: true }));
            });
    }, []);

    const provider = {
        ...globalState,

        setSubgroup: (subgroup) => setGlobalState(state => ({...state, subgroup})),
        setCurr: (curr) => setGlobalState(state => ({...state, prev: state.curr, curr})),

        createHometaskSetter: (weekIndex, dayIndex, subjectIndex) => (newHometask) => {
            const weekList = globalState.weekList;
            const subjects = weekList[weekIndex].days[dayIndex].subjects;
            const { subjShort, type, numSubgroup, employees } = subjects[subjectIndex];

            subjects.forEach(item => {
                if (item.subjShort === subjShort && item.type === type &&
                    item.numSubgroup === numSubgroup && item.employees[0].id == employees[0].id) {
                    item.hometask = newHometask;
                }
            });
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

    return (
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

const useLoadingState = () => {
    const context = useContext(Context),
        { isLoading, isError } = context;

    return { isLoading, isError };
}

export {
    useWeekList,
    useGroupNum,
    useCurr,
    useSubgroup,
    useWeek,
    useDay,
    useNotes,
    useSubject,
    useLoadingState
};
'use client';

import { LOCAL_STORAGE_GROUP_NUM } from "@/env/env";
import { createContext, useContext, useState, useEffect } from "react";
import getTimetable from '@/server/actions';
import Loading from "./loading/Loading";
import Error from "@/app/error";

const Context = createContext(null);

const GlobalContext = ({ groupNum, children }) => {
    const [globalState, setGlobalState] = useState({
        subgroup: 0,
        prev: -1,
        curr: -1,
        weekList: [],
        groupNum
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        getTimetable(groupNum)
            .then(res => {
                const { weekList, currWeekIndex: curr } = res;

                localStorage.setItem(LOCAL_STORAGE_GROUP_NUM, groupNum);

                setGlobalState(state => ({ ...state, prev: curr, curr, weekList }));
            })
            .catch(err => {
                console.error(err);
                setIsError(true);
            })
            .finally(() => setIsLoading(false));
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
        editNote: (notes, noteIndex, newNote) => 
            notes.map((note, i) => i === noteIndex ? newNote : note),
    };

    if (isLoading) return <Loading/>;
    if (isError) return <Error/>;

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
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
        .catch(err => {
            console.error(err);
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

        setSubgroup(subgroup) {
            setGlobalState(state => ({...state, subgroup}));
        },

        setCurr(curr) {
            setGlobalState(state => ({...state, prevCurr: state.curr, curr}));
        },

        getEditedHtList(weekIndex, dayIndex, htIndex, text) {
            const { hometasks } = globalState.weekList[weekIndex].days[dayIndex];

            return text ?
            hometasks.map((ht, i) => i === htIndex ? ({...ht, text}) : ht) :
            hometasks.filter((_, i) => i !== htIndex);
        },

        addHometask(hometask, weekIndex, dayIndex, subjIndex) {
            const weekList = globalState.weekList,
                  { subjects, hometasks } = globalState.weekList[weekIndex].days[dayIndex],
                  subject = subjects[subjIndex];

            subject.htIndex = hometasks.push(hometask) - 1;
            setGlobalState(state => ({...state, weekList}));
        },

        editHometask(htList, weekIndex, dayIndex) {
            const weekList = globalState.weekList;

            weekList[weekIndex].days[dayIndex].hometasks = htList;
            setGlobalState(state => ({...state, weekList}));
        },

        deleteHometask(htList, htIndex, weekIndex, dayIndex) {
            const weekList = globalState.weekList,
                  day = weekList[weekIndex].days[dayIndex];

            day.hometasks = htList;

            day.subjects.forEach(item => {
                if (item.htIndex < 0) return;

                if (item.htIndex === htIndex) {
                    item.htIndex = -1;
                    return;
                }

                if (item.htIndex > htIndex) {
                    item.htIndex--;
                }
            });

            setGlobalState(state => ({...state, weekList}));
        },

        setNotes(newNoteList, weekIndex, dayIndex) {
            const weekList = globalState.weekList;

            weekList[weekIndex].days[dayIndex].notes = newNoteList;
            setGlobalState(state => ({...state, weekList}));
        },

        deleteNote(weekIndex, dayIndex, noteIndex) {
            return globalState.weekList[weekIndex].days[dayIndex].notes
                    .filter((_, i) => i !== noteIndex);
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
          context = useContext(Context),
          { addHometask, editHometask, deleteHometask, getEditedHtList } = context;

    return { ...subject, addHometask, editHometask, deleteHometask, getEditedHtList };
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
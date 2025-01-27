import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subgroup: 0,
    prev: -1,
    curr: -1,
    weekList: [],
    groupNum: 0
};

const weekListSlice = createSlice({
    name: "weekList",
    initialState,
    reducers: {
        setWeekList(state, action) {
            const { weekList, curr, groupNum } = action.payload;
            state.curr = curr;
            state.prev = curr;
            state.groupNum = groupNum;
            state.weekList = weekList;
        },
        setSubgroup(state, action) {
            state.subgroup = action.payload;
        },
        setCurr(state, action) {
            state.prev = state.curr;
            state.curr = action.payload;
        },
        setHometask(state, action) {
            const { weekIndex, dayIndex, updatedSubjects } = action.payload;
            state.weekList[weekIndex].days[dayIndex].subjects = updatedSubjects;
        },
        setNotesList(state, action) {
            const { weekIndex, dayIndex, notesList } = action.payload;
            state.weekList[weekIndex].days[dayIndex].notes = notesList;
        }
    },
});
  
const { actions, reducer } = weekListSlice;

export const {
    setWeekList,
    setSubgroup,
    setCurr,
    createNotesSetters
} = actions;

export default reducer;
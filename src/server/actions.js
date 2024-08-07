'use server';

import { FACULTY_API_URL, SCHEDULE_API_URL, GROUP_API_URL, SERVER_URL } from "@/env/env";

export const request = async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
    const res = await fetch(url, { method, headers, body, cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}, status: ${res.statusText}`);
    } 
    
    return await res.json();
}

export const getGroups = async () => {
    return new Promise((resolve, reject) => {
        Promise.all([request(GROUP_API_URL), request(FACULTY_API_URL)])
            .then(([groups, faculties]) => resolve(groups.map(group => ({
                groupNum: group.name,
                faculty: faculties.find(item => item.id === group.facultyId).abbrev,
                speciality: group.specialityName,
                course: group.course
            }))))
            .catch(error => reject(error));
    });
}

export default async function getTimetable(groupNum) {
    return new Promise((resolve, reject) => {
        Promise.all([request(`${SCHEDULE_API_URL}${groupNum}`), request(`${SERVER_URL}/days/${groupNum}`)])
            .then(values => resolve(parseTimetable(...values)))
            .catch(error => reject(error));
    });
}

const parseTimetable = (response, listOfWeeks) => {
    const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
          schedules = response.schedules || response.currentSchedules?.schedules || response.previousSchedules,
          dateStr = new Date().toJSON().slice(0, 10),
          exclusions = ['Консультация', 'Экзамен'];
    let currWeekIndex = 0, firstEmptyWeek = -1, lastEmptyWeek = -1;

    const getTime = (dateStr) => new Date(dateStr.split('.').reverse().join('-')).getTime();
    
    const timetable = days.map(item => {
        const day = schedules[item];

        return day ? {
            name: item,
            subjects: day.filter(subj => !exclusions.includes(subj.lessonTypeAbbrev)).map(subj => ({
                auditories: subj.auditories.length ? subj.auditories : [""],
                startLessonDate: subj.startLessonDate,
                endLessonDate: subj.endLessonDate,
                start: subj.startLessonTime,
                end: subj.endLessonTime,
                numSubgroup: subj.numSubgroup,
                subjShort: subj.subject,
                subject: subj.subjectFullName,
                type: subj.lessonTypeAbbrev,
                weeks: subj.weekNumber,
                note: subj.note,
                employees: subj.employees.length ? subj.employees.map(emp => ({
                    firstName: emp.firstName,
                    middleName: emp.middleName,
                    lastName: emp.lastName,
                    photoLink: emp.photoLink
                })) : [{
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    photoLink: ""
                }]
            }))
        } : null;
    });

    const weekList = listOfWeeks.map((item, i) => ({
        days: item.map((day, index) => {
            if (day.date === dateStr) currWeekIndex = i;

            const dayDate = new Date(day.date).getTime(),
                    weekNum = i % 4 + 1,
                    fullDayTimetable = timetable.find(unit => unit?.name === day.name)?.subjects;

            const subjects = fullDayTimetable?.filter(subj => {
                const subjStartDate = getTime(subj.startLessonDate),
                        subjEndDate = getTime(subj.endLessonDate);

                return subj.weeks?.includes(weekNum) && dayDate >= subjStartDate && dayDate <= subjEndDate;
            }).map(subj => {
                const { subjShort, type: subjType, employees, numSubgroup } = subj;
                
                return {
                    ...subj,
                    hometask: day.hometasks.find(task => {
                        const { subject, type: taskType, teacher, subgroup } = task;

                        return subject === subjShort && taskType === subjType && 
                               subgroup === numSubgroup && 
                               (subject !== 'ИнЯз' || JSON.stringify(teacher) === JSON.stringify(employees[0]));
                    }) || null
                }
            });

            return {
                date: day.date,
                day: day.name,
                dayNum: index + 1,
                notes: day.notes,
                subjects
            };
        }).filter(day => day.subjects?.length)
    })).filter((item, i) => {
        if (!item.days.length) {
            if (firstEmptyWeek < 0) firstEmptyWeek = i;

            lastEmptyWeek = i;
        }

        return item.days.length;
    });
    
    if (currWeekIndex >= firstEmptyWeek && firstEmptyWeek >= 0) {
        if (currWeekIndex <= lastEmptyWeek) {
            currWeekIndex = Math.max(firstEmptyWeek - 1, 0);
        } else {
            currWeekIndex += firstEmptyWeek - lastEmptyWeek - 1;
        }
    }

    return { weekList, currWeekIndex };
}
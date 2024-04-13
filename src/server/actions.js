'use server';

import { API_URL, SERVER_URL } from "@/env/env";

export const request = async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
    return fetch(url, { method, headers, body, cache: 'no-store' })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch ${url}, status: ${res.statusText}`);
                }

                return res.json();
            })
            .catch(e => {
                throw new Error(`Error while fetching ${url}: ${e.message}`);
            });
}

export default async function getTimetable() {
    return new Promise((resolve, reject) => {
        Promise.all([request(API_URL), request(`${SERVER_URL}/weekList`)])
                .then(values => resolve(parseTimetable(...values)))
                .catch(error => reject(error));
    });
}

const parseTimetable = (response, listOfWeeks) => {
    const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
          schedules = response.schedules || response.currentSchedules?.schedules || response.previousSchedules,
          date = new Date(),
          currDate = date.getDate(),
          currMonth = date.getMonth(),
          currYear = date.getFullYear(),
          dateStr = `${currDate < 10 ? `0${currDate}` : currDate}.${currMonth + 1 < 10 ? `0${currMonth + 1}` : currMonth + 1}.${currYear}`,
          exclusions = ['Консультация', 'Экзамен'];
    let currWeekIndex = 0, firstEmptyWeek = -1, lastEmptyWeek = -1;

    const getTime = (dateStr) => new Date(dateStr.split('.').reverse().join('-')).getTime();
    
    const timetable = days.map(item => {
        const day = schedules[item];

        return {
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
        }
    });

    const weekList = listOfWeeks.map((item, i) => ({
        ...item,
        days: item.days.map((day, index) => {
            if (day.date === dateStr) {
                currWeekIndex = i;
            }

            if (day.day === 'Воскресенье') return null;

            const dayDate = getTime(day.date),
                  weekNum = item.id % 4 || 4,
                  [{subjects: fullDayTimetable}] = timetable.filter(unit => unit.name === day.day);

            const subjects = fullDayTimetable.filter(subj => {
                const subjStartDate = getTime(subj.startLessonDate),
                      subjEndDate = getTime(subj.endLessonDate);

                return subj.weeks?.includes(weekNum) && dayDate >= subjStartDate && dayDate <= subjEndDate;
            }).map(subj => {
                let htIndex = -1;

                day.hometasks.forEach((task, i) => {
                    if (task.subject === subj.subjShort && (task.subject === 'ИнЯз' ? JSON.stringify(task.teacher) === JSON.stringify(subj.employees[0]) : true) && task.type === subj.type) {
                        htIndex = i;
                    }
                });

                return {
                    ...subj,
                    htIndex
                };
            });

            return {
                date: day.date.substring(0, day.date.lastIndexOf('.')),
                day: day.day,
                dayNum: index + 1,
                notes: day.notes,
                hometasks: day.hometasks,
                subjects
            };
        }).filter(day => day && day.subjects.length)
    })).filter((item, i) => {
        if (!item.days.length && firstEmptyWeek < 0) {
            lastEmptyWeek = firstEmptyWeek = i;
        } else if (!item.days.length) {
            lastEmptyWeek = i;
        }

        return item.days.length;
    });
    
    return {
        weekList,
        currWeekIndex: currWeekIndex >= firstEmptyWeek && firstEmptyWeek >= 0 ? 
        currWeekIndex <= lastEmptyWeek ? 
        firstEmptyWeek > 0 ? firstEmptyWeek - 1 : 0 
        : currWeekIndex + firstEmptyWeek - lastEmptyWeek - 1 
        : currWeekIndex
    }
}
import Subject from "../subject/Subject";
import styles from "./day.module.css";

const Day = ({ date, day, subjects, weekIndex, dayIndex, hometasks, setHometasks, i }) => {
    const renderSubjects = () => subjects.map((item, j) => {
        const { auditories, startLessonTime, endLessonTime, numSubgroup, subject, subjectFullName, type, weekNumber, note, employees } = item;

        return <Subject key={j}
                        auditory={auditories[0]}
                        start={startLessonTime}
                        end={endLessonTime}
                        subgroup={numSubgroup}
                        subject={subjectFullName}
                        subjShort={subject}
                        type={type}
                        note={note}
                        weeks={weekNumber}
                        teacher={employees[0]}
                        weekIndex={weekIndex}
                        dayIndex={dayIndex}
                        hometask={hometasks[i][j]}
                        setHometasks={setHometasks}
                        dayI={i}
                        ind={j}/>;
    });

    const elements = renderSubjects();

    return (
        <div className={`${styles.day} ${dayIndex < 3 ? styles.first : styles.second}`}>
            <p className={styles.text}>{date}, {day}</p>
            <ul className={styles.subjectList}>
                {elements}
            </ul>
        </div>
    );
}

export default Day;
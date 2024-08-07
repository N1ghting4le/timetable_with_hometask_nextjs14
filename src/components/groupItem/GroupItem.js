'use client'

import { LOCAL_STORAGE_GROUP_NUM, LOCAL_STORAGE_SAVED_GROUPS } from '@/env/env';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import useMouseCoords from '@/hooks/mouseCoords.hook';
import Link from 'next/link';
import styles from './groupItem.module.css';

const GroupItem = ({ group, setGroups }) => {
    const { groupNum, faculty, speciality, course } = group;
    const [coords, setCoords] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [isOverlay, setIsOverlay] = useState(false);
    const getPosition = useMouseCoords();
    const pathname = usePathname();

    const handleClick = () => {
        if (setGroups) return;

        const savedGroups = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVED_GROUPS)) || [];

        if (!savedGroups.find(item => item.groupNum === groupNum)) {
            localStorage.setItem(LOCAL_STORAGE_SAVED_GROUPS, JSON.stringify([...savedGroups, group]));
        }
    }

    const handleRightClick = (e) => {
        if (!setGroups) return;
        
        e.preventDefault();

        const { x, y } = getPosition(e, 100);

        setIsActive(true);
        setIsOverlay(true);
        setCoords({ left: `${x}px`, top: `${y}px` });
    }

    const deleteGroup = () => {
        if (pathname === `/${groupNum}`) {
            localStorage.removeItem(LOCAL_STORAGE_GROUP_NUM);
        }

        setGroups(groups => {
            const newSavedGroups = groups.filter(group => group.groupNum !== groupNum);

            localStorage.setItem(LOCAL_STORAGE_SAVED_GROUPS, JSON.stringify(newSavedGroups));

            return newSavedGroups;
        });
    }

    const closeButton = (e) => {
        setTimeout(() => setIsActive(false), 200);
        setIsOverlay(false);
        e.target.nextElementSibling.style.opacity = 0;
    }

    return (
        <>
            <Link href={`/${groupNum}`} className={styles.groupItem} onClick={handleClick} onContextMenu={handleRightClick}>
                <p className={styles.groupNum}>{groupNum}</p>
                <div className={styles.details}>
                    <p>{course} курс,</p>
                    <p>{faculty} - {speciality}</p>
                </div>
            </Link>
            { isOverlay ? <div className={styles.overlay} onClick={closeButton}/> : null }
            { isActive ? <button className={styles.button} onClick={deleteGroup} style={coords}>Удалить</button> : null } 
        </>
    );
}

export default GroupItem;
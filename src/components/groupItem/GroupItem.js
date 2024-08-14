'use client'

import { LOCAL_STORAGE_GROUP_NUM, LOCAL_STORAGE_SAVED_GROUPS } from '@/env/env';
import { usePathname } from 'next/navigation';
import useContextMenu from '@/hooks/contextMenu.hook';
import ContextMenu from '../contextMenu/ContextMenu';
import Link from 'next/link';
import styles from './groupItem.module.css';

const GroupItem = ({ group, setGroups }) => {
    const { groupNum, faculty, speciality, course } = group;
    const pathname = usePathname();
    const contextWidth = 100;
    const { triggerContextMenu, ...props } = useContextMenu(contextWidth);

    const handleClick = () => {
        if (setGroups) return;

        const savedGroups = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVED_GROUPS)) || [];

        if (!savedGroups.find(item => item.groupNum === groupNum)) {
            localStorage.setItem(LOCAL_STORAGE_SAVED_GROUPS, JSON.stringify([...savedGroups, group]));
        }
    }

    const handleRightClick = (e) => {
        if (!setGroups) return;
        
        triggerContextMenu(e);
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

    return (
        <>
            <Link href={`/${groupNum}`} className={styles.groupItem} onClick={handleClick} onContextMenu={handleRightClick}>
                <p className={styles.groupNum}>{groupNum}</p>
                <div className={styles.details}>
                    <p>{course} курс,</p>
                    <p>{faculty} - {speciality}</p>
                </div>
            </Link>
            <ContextMenu {...props}>
                <button onClick={deleteGroup}>Удалить</button>
            </ContextMenu> 
        </>
    );
}

export default GroupItem;
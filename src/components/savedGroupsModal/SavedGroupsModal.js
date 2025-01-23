'use client';

import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_SAVED_GROUPS, LOCAL_STORAGE_GROUP_NUM } from '@/env/env';
import Link from 'next/link';
import Modal from '../modal/Modal';
import GroupItem from '../groupItem/GroupItem';
import styles from './savedGroupsModal.module.css';
import './modal.css';

const SavedGroupsModal = ({ buttonClass }) => {
    const [groups, setGroups] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const savedGroups = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVED_GROUPS));
        const lastViewedGroup = localStorage.getItem(LOCAL_STORAGE_GROUP_NUM);

        setGroups(savedGroups);
        setActiveGroup(savedGroups.find(group => group.groupNum == lastViewedGroup));
    }, []);

    return (
        <>
            <button onClick={() => setOpen(true)} className={buttonClass}>Группы</button>
            <Modal
                open={open} onClose={() => setOpen(false)} align="left top" className="groups"
                style={{ maxHeight: "100vh", animation: "slide 0.25s ease-out" }}>
                <h2>Текущая группа:</h2>
                {activeGroup && <GroupItem group={activeGroup} setGroups={setGroups} active/>}
                <h3>Сохранённые группы:</h3>
                {groups.map(group => <GroupItem key={group.groupNum} group={group} setGroups={setGroups}/>)}
                <Link href='/' className={styles.link}>Вернуться к выбору группы</Link>
            </Modal>
        </>
    );
}

export default SavedGroupsModal;
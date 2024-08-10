'use client';

import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_SAVED_GROUPS } from '@/env/env';
import Link from 'next/link';
import Modal from '../modal/Modal';
import GroupItemsList from '../groupItemsList/GroupItemsList';
import styles from './savedGroupsModal.module.css';
import './modal.css';

const SavedGroupsModal = ({ buttonClass }) => {
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setGroups(JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVED_GROUPS)));
    }, []);

    return (
        <>
            <button onClick={() => setOpen(true)} className={buttonClass}>Группы</button>
            <Modal open={open} onClose={() => setOpen(false)} align="left top" className="groups">
                <h2>Сохранённые группы:</h2>
                <GroupItemsList groups={groups} setGroups={setGroups}/>
                <Link href='/' className={styles.link}>Вернуться к выбору группы</Link>
            </Modal>
        </>
    );
}

export default SavedGroupsModal;
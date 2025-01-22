'use client';

import Loading from '../loading/Loading';
import GroupItemsList from '../groupItemsList/GroupItemsList';
import { useState } from 'react';
import { useGroups } from '../GroupContext';
import styles from './groupsForm.module.css';

const GroupsForm = () => {
    const [input, setInput] = useState('');
    const groups = useGroups();

    const handleChange = (e) => setInput(e.target.value);

    return groups.length ? (
        <div className={styles.wrapper}>
            <p className={styles.title}>Выберите группу:</p>
            <div className={styles.form}>
                <div className={styles.inputWrapper}>
                    <input type='text' placeholder=" " className={styles.input} onChange={handleChange}/>
                    <label htmlFor="" className={styles.label}>Начните вводить номер группы</label>
                </div>
            </div>
            <GroupItemsList groups={groups.filter(group => group.groupNum.includes(input))}/>
        </div>
    ) : <Loading/>;
}

export default GroupsForm;
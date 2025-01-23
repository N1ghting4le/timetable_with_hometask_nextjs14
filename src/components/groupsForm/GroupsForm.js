'use client';

import GroupItemsList from '../groupItemsList/GroupItemsList';
import Loading from '../loading/Loading';
import Error from '@/app/error';
import { useState } from 'react';
import { useGroups } from '../GroupContext';
import styles from './groupsForm.module.css';

const GroupsForm = () => {
    const [input, setInput] = useState('');
    const { groups, isLoading, isError } = useGroups();

    const handleChange = (e) => setInput(e.target.value);

    if (isLoading) return <Loading/>;
    if (isError) return <Error/>;

    return (
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
    );
}

export default GroupsForm;
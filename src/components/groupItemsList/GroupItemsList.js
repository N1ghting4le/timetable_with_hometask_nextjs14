import GroupItem from '../groupItem/GroupItem';
import styles from './groupItemsList.module.css';

const GroupItemsList = ({ groups, setGroups }) => (
    <div className={styles.groups}>
        {groups.map(group => <GroupItem key={group.groupNum} group={group} setGroups={setGroups}/>)}
    </div>
);

export default GroupItemsList;
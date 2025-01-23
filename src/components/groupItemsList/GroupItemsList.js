import GroupItem from '../groupItem/GroupItem';
import styles from './groupItemsList.module.css';

const GroupItemsList = ({ groups }) => (
    <div className={styles.groups}>
        {groups.map(group => <GroupItem key={group.groupNum} group={group}/>)}
    </div>
);

export default GroupItemsList;
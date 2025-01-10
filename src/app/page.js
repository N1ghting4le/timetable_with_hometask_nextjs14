import styles from './page.module.css';
import GroupsForm from '@/components/groupsForm/GroupsForm';
import { getGroups } from '@/server/actions';

export default async function Home() {
  const groups = await getGroups();

  return (
    <main className={styles.main}>
      <GroupsForm groups={groups}/>
    </main>
  );
}
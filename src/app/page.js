import styles from './page.module.css';
import GroupsForm from '@/components/groupsForm/GroupsForm';

export default async function Home() {
  return (
    <main className={styles.main}>
      <GroupsForm/>
    </main>
  );
}
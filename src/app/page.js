import WeekList from '@/components/weekList/WeekList';
import styles from './page.module.css';

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className={styles.main}>
      <WeekList/>
    </main>
  );
}

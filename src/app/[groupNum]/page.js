import { notFound } from 'next/navigation';
import WeekList from '@/components/weekList/WeekList';

export async function generateMetadata({ params }) {
  return {
    title: 'Расписание группы ' + params.groupNum
  }
}

export default function Page({ params }) {
  if (Number.isNaN(+params.groupNum)) return notFound();

  return <WeekList groupNum={params.groupNum}/>;
}
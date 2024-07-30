import { notFound } from 'next/navigation';
import GlobalContext from '@/components/GlobalContext';
import WeekList from '@/components/weekList/WeekList';

export default async function Page({ params }) {
  if (Number.isNaN(+params.groupNum)) return notFound();

  return (
    <GlobalContext groupNum={params.groupNum}>
      <WeekList/>
    </GlobalContext>
  );
}
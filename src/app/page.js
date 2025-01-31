import GroupsForm from '@/components/groupsForm/GroupsForm';

export const metadata = {
  title: 'Список групп',
  description: 'Страница для поиска и выбора группы из списка групп'
}

export default function Home() {
  return <GroupsForm/>;
}
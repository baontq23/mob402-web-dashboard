import { Card } from '@mui/material';
import RecentOrdersTable from './ListUsersTable';
import { subDays } from 'date-fns';
import { IUser } from '@/models/user';

const ListUsers = () => {
  const cryptoOrders: IUser[] = [
    {
      id: '1',
      avatar: null,
      email: 'baontq@gmail.com',
      isEmailVerified: false,
      name: 'Bao Nguyen Test 1',
      role: 'user',
      createAt: '',
      updateAt: ''
    }
  ];

  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders} />
    </Card>
  );
};

export default ListUsers;

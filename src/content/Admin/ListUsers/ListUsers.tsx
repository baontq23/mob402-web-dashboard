import { Card } from '@mui/material';
import ListUsersTable from './ListUsersTable';
import { IUser } from '@/models/user';

const ListUsers = () => {
  const users: IUser[] = [
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
      <ListUsersTable users={users} />
    </Card>
  );
};

export default ListUsers;

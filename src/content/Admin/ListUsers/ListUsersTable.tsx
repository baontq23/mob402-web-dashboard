import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Box,
  FormControl,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  TextField,
  Button
} from '@mui/material';

import Label from '@/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { IUser } from '@/models/user';

interface RecentOrdersTableProps {
  users: IUser[];
}
const getStatusLabel = (userEmailVerifiedStatus: boolean): JSX.Element => {
  return userEmailVerifiedStatus ? (
    <Label color={'success'}>{'Verified'}</Label>
  ) : (
    <Label color={'warning'}>{'Pending'}</Label>
  );
};

const ListUsersTable: FC<RecentOrdersTableProps> = ({ users }) => {
  const [data] = useState<IUser[]>(users);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const selectedBulkActions = selectedUsers.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const [searchValue, setSearchValue] = useState<string>('');
  const handleSearch = (q: string) => {
    setSearchValue(q);
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedUsers(event.target.checked ? data.map((user) => user.id) : []);
  };

  const handleSelectOneUser = (
    _event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedUsers.includes(cryptoOrderId)) {
      setSelectedUsers((prevSelected) => [...prevSelected, cryptoOrderId]);
    } else {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const selectedSomeCryptoOrders =
    selectedUsers.length > 0 && selectedUsers.length < data.length;
  const selectedAllCryptoOrders = selectedUsers.length === data.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h5" color="text.secondary">
                Thao tác hàng loạt:
              </Typography>
              <Button
                color="error"
                sx={{ ml: 1 }}
                startIcon={<DeleteTwoToneIcon />}
                variant="contained"
              >
                Xoá
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      {!selectedBulkActions && (
        <Box flex={1} p={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              Thêm người dùng
            </Button>

            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  label={'Search'}
                />
              </FormControl>
            </Box>
          </Box>
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell>
              <TableCell>Họ tên và email</TableCell>
              <TableCell>Thời gian tạo</TableCell>
              <TableCell>Cập nhật gần đây</TableCell>
              <TableCell align="right">Ảnh</TableCell>
              <TableCell align="right">Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user) => {
              const isCryptoOrderSelected = selectedUsers.includes(user.id);
              return (
                <TableRow hover key={user.id} selected={isCryptoOrderSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneUser(event, user.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.createAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.updateAt}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.avatar}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {getStatusLabel(user.isEmailVerified)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={data.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

ListUsersTable.propTypes = {
  users: PropTypes.array.isRequired
};

ListUsersTable.defaultProps = {
  users: []
};

export default ListUsersTable;

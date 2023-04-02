import { FC, ChangeEvent, useState, useCallback, useEffect } from 'react';
import {
  Tooltip,
  Box,
  FormControl,
  Card,
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
  Button,
  useMediaQuery
} from '@mui/material';

import Label from '@/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import RemoveRedEyeOutlined from '@mui/icons-material/RemoveRedEyeOutlined';
import { IUser } from '@/models/user';
import axiosInstance from '@/config/api';
import { useRouter } from 'next/router';

interface Props {}
const getStatusLabel = (userEmailVerifiedStatus: boolean): JSX.Element => {
  return userEmailVerifiedStatus ? (
    <Label color={'success'}>{'Verified'}</Label>
  ) : (
    <Label color={'warning'}>{'Pending'}</Label>
  );
};

const ListUsersTable: FC<Props> = () => {
  const route = useRouter();
  const [data, setData] = useState<IUser[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [showImage, setShowImage] = useState<boolean>(false);

  const [searchValue, setSearchValue] = useState<string>('');
  const handleSearch = (q: string) => {
    setSearchValue(q);
  };

  const handleGetData = useCallback(() => {
    const params = searchValue
      ? { name: searchValue, page: page + 1, limit }
      : { page: page + 1, limit };
    axiosInstance({
      url: 'v1/users',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      },
      params
    })
      .then((res) => {
        setData(res.data.results);
        setTotal(res.data.totalResults);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [page, limit, searchValue]);

  useEffect(() => {
    handleGetData();
  }, [page, limit, searchValue]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Card>
      <Box flex={1} p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
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
                type={'search'}
              />
            </FormControl>
          </Box>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên và email</TableCell>
              <TableCell>Quyền</TableCell>
              <TableCell align="right">Ảnh</TableCell>
              <TableCell align="right">Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user) => {
              return (
                <TableRow hover key={user.id}>
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
                      {user.role}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ maxWidth: 100 }}>
                    {showImage ? (
                      !fullScreen ? (
                        <img
                          onClick={() => setShowImage(false)}
                          src={user.avatar_link}
                          alt={'Product image'}
                          width={'100%'}
                        />
                      ) : (
                        <img
                          onClick={() => setShowImage(false)}
                          src={user.avatar_link}
                          alt={'Avatar'}
                          width={'150%'}
                        />
                      )
                    ) : (
                      <Tooltip title="Xem ảnh" arrow>
                        <IconButton
                          onClick={() => setShowImage(true)}
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <RemoveRedEyeOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {getStatusLabel(user.isEmailVerified)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        onClick={() =>
                          route.push(`/admin/list-users/${user.id}`)
                        }
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
          count={total}
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

export default ListUsersTable;

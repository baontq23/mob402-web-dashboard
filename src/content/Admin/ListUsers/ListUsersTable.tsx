import { FC, ChangeEvent, useState, useCallback, useEffect } from 'react';
import { styled } from '@mui/material/styles';
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
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  FormHelperText,
  DialogActions,
  Select,
  MenuItem
} from '@mui/material';

import Label from '@/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import RemoveRedEyeOutlined from '@mui/icons-material/RemoveRedEyeOutlined';
import { IUser } from '@/models/user';
import axiosInstance from '@/config/api';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

interface Props {}
const getStatusLabel = (userEmailVerifiedStatus: boolean): JSX.Element => {
  return userEmailVerifiedStatus ? (
    <Label color={'success'}>{'Verified'}</Label>
  ) : (
    <Label color={'warning'}>{'Pending'}</Label>
  );
};

const schema = yup.object().shape({
  name: yup.string().required(),
  password: yup.string().required(),
  email: yup.string().required(),
  role: yup.string().required()
});

const ListUsersTable: FC<Props> = () => {
  const route = useRouter();
  const [data, setData] = useState<IUser[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<File>(null);
  const [openAddUserDialog, setOpenAddUserDialog] = useState<boolean>(false);
  //Add Dialog State
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user'
    }
  });
  const handleCloseAddUserDialog = () => {
    reset();
    setOpenAddUserDialog(false);
    setImagePreview(null);
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    setImagePreview(e.target.files[0]);
  };
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
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('role', data.role);
    imagePreview &&
      formData.append('avatar', imagePreview, Date.now() + imagePreview.name);

    handleCloseAddUserDialog();
    axiosInstance({
      method: 'POST',
      url: 'v1/users',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .then((res) => {
        if (res.status === 201) {
          alert('Thêm người dùng thành công!');
          handleGetData();
        } else {
          alert('Thêm người dùng thất bại!');
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 400) {
          alert('Thông tin không hợp lệ. Mật khẩu bao gồm chữ hoa và chữ số');
        } else {
          alert('Server error');
        }
      });
  };

  const handleDeleteUser = (id: string) => {
    axiosInstance({
      method: 'DELETE',
      url: 'v1/users/' + id,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
      .then((res) => {
        if (res.status === 204) {
          alert('Xoá thành công!');
          handleGetData();
        } else {
          alert('Xoá thất bại');
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Đã có lỗi xảy ra!');
      });
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const Input = styled('input')({
    display: 'none'
  });

  const ImageWrapper = styled(Card)(
    ({ theme }) => `
      position: relative;
      overflow: visible;
      display: inline-block;
      .MuiAvatar-root {
        width: ${theme.spacing(16)};
        height: ${theme.spacing(16)};
      }
  `
  );
  const ButtonUploadWrapper = styled(Box)(
    ({ theme }) => `
      position: absolute;
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      bottom: -${theme.spacing(1)};
      right: -${theme.spacing(1)};
  
      .MuiIconButton-root {
        border-radius: 100%;
        background: ${theme.colors.primary.main};
        color: ${theme.palette.primary.contrastText};
        box-shadow: ${theme.colors.shadows.primary};
        width: ${theme.spacing(4)};
        height: ${theme.spacing(4)};
        padding: 0;
    
        &:hover {
          background: ${theme.colors.primary.dark};
        }
      }
  `
  );
  return (
    <Card>
      <Box flex={1} p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            onClick={() => setOpenAddUserDialog(true)}
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
                          alt={'Avatar'}
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
                        onClick={() =>
                          confirm('Bạn có muốn xoá người dùng này ?') &&
                          handleDeleteUser(user.id)
                        }
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
      <Dialog
        fullScreen={fullScreen}
        open={openAddUserDialog}
        onClose={handleCloseAddUserDialog}
      >
        <DialogTitle>Thêm người dùng</DialogTitle>
        <form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
          <DialogContent>
            <ImageWrapper sx={{ margin: imagePreview ? 0 : 10 }}>
              <img
                src={imagePreview ? URL.createObjectURL(imagePreview) : ''}
                width={'100%'}
              />
              <ButtonUploadWrapper>
                <Input
                  accept="image/*"
                  id="icon-button-file"
                  name="icon-button-file"
                  type="file"
                  onChange={handleChangeImage}
                />
                <label htmlFor="icon-button-file">
                  <IconButton component="span" color="primary">
                    <UploadTwoToneIcon />
                  </IconButton>
                </label>
              </ButtonUploadWrapper>
            </ImageWrapper>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoFocus
                  margin="dense"
                  label="Họ tên"
                  type="text"
                  fullWidth
                  error={!!errors.name}
                  variant="standard"
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.name.message}
              </FormHelperText>
            )}
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  margin="dense"
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  fullWidth
                  variant="standard"
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.email.message}
              </FormHelperText>
            )}
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  margin="dense"
                  label="Mật khẩu"
                  error={!!errors.password}
                  type="password"
                  fullWidth
                  variant="standard"
                />
              )}
            />
            {errors.password && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.password.message}
              </FormHelperText>
            )}
            <Controller
              name="role"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <Select
                  value={value}
                  label="Quyền"
                  onChange={onChange}
                  fullWidth
                  onBlur={onBlur}
                  variant={'standard'}
                >
                  <MenuItem value={'admin'}>Admin</MenuItem>
                  <MenuItem value={'user'}>User</MenuItem>
                </Select>
              )}
            />
            {errors.role && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.role.message}
              </FormHelperText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddUserDialog}>Huỷ bỏ</Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
};

export default ListUsersTable;

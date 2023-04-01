import { FC, ChangeEvent, useState, useCallback, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Tooltip,
  Divider,
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
  DialogActions,
  FormHelperText
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import RemoveRedEyeOutlined from '@mui/icons-material/RemoveRedEyeOutlined';
import { IProduct } from '@/models/product';
import axiosInstance from '@/config/api';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
interface ListProductsTableProps {
  className?: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().min(0).required(),
  color: yup.string().required(),
  type: yup.string().required()
});

const ListProductsTable: FC<ListProductsTableProps> = () => {
  const route = useRouter();
  const [showImage, setShowImage] = useState<boolean>(false);
  // const [searchData, setSearchData] = useState<IProduct[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<IProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

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
      type: '',
      color: '',
      price: 0
    }
  });
  const [imagePreview, setImagePreview] = useState<File>(null);
  const [openAddProductDialog, setOpenAddProductDialog] =
    useState<boolean>(false);

  const handleCloseAddProductDialog = () => {
    reset();
    setOpenAddProductDialog(false);
    setImagePreview(null);
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    setImagePreview(e.target.files[0]);
  };

  const handleSearch = (q: string) => {
    setSearchValue(q);
  };

  const handleGetData = useCallback(() => {
    axiosInstance({
      url: 'v1/products',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      },
      params: {
        page: page + 1,
        limit
      }
    })
      .then((res) => {
        setData(res.data.results);
        setTotal(res.data.totalResults);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [page, limit]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('type', data.type);
    formData.append('color', data.color);
    formData.append('price', data.price);
    imagePreview &&
      formData.append('image', imagePreview, Date.now() + imagePreview.name);

    handleCloseAddProductDialog();
    axiosInstance({
      method: 'POST',
      url: 'v1/products',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .then((res) => {
        if (res.status === 201) {
          alert('Thêm sản phẩm thành công!');
          handleGetData();
        } else {
          alert('Thêm sản phẩm thất bại!');
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Server error');
      });
  };

  const handleDeleteProduct = (id: string) => {
    axiosInstance({
      method: 'DELETE',
      url: 'v1/products/' + id,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
      .then((res) => {
        if (res.status === 204) {
          alert('Xoá sản phẩm thành công!');
          handleGetData();
        } else {
          alert('Xoá sản phẩm thất bại');
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Đã có lỗi xảy ra!');
      });
  };

  useEffect(() => {
    handleGetData();
  }, [page, limit]);

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
            onClick={() => setOpenAddProductDialog(true)}
            sx={{ mr: 2 }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Thêm sản phẩm
          </Button>

          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <TextField
                value={searchValue}
                type="search"
                onChange={(e) => handleSearch(e.target.value)}
                label={'Search'}
              />
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Màu sắc</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((product) => {
              return (
                <TableRow hover key={product.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.type}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    {showImage ? (
                      !fullScreen ? (
                        <img
                          onClick={() => setShowImage(false)}
                          src={product.image_link}
                          alt={'Product image'}
                          width={'100%'}
                        />
                      ) : (
                        <img
                          onClick={() => setShowImage(false)}
                          src={product.image_link}
                          alt={'Product image'}
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
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {product.color}
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
                      {product.price}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Sửa" arrow>
                      <IconButton
                        onClick={() =>
                          route.push(`/management/list-products/${product.id}`)
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
                    <Tooltip title="Xoá" arrow>
                      <IconButton
                        onClick={() =>
                          confirm('Bạn có muốn xoá sản phẩm này ?') &&
                          handleDeleteProduct(product.id)
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
          labelRowsPerPage={'Số sản phẩm hiển thị'}
          labelDisplayedRows={({ from, to, count }) => {
            return `Sản phẩm thứ ${from} đến ${to} trong số ${
              count !== -1 ? `${count} sản phẩm` : `more than ${to}`
            }`;
          }}
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
        open={openAddProductDialog}
        onClose={handleCloseAddProductDialog}
      >
        <DialogTitle>Thêm sản phẩm</DialogTitle>
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
                  label="Tên sản phẩm"
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
              name="price"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  margin="dense"
                  label="Đơn giá"
                  type="number"
                  error={!!errors.price}
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                  variant="standard"
                />
              )}
            />
            {errors.price && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.price.message}
              </FormHelperText>
            )}
            <Controller
              name="color"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  margin="dense"
                  label="Màu sắc"
                  error={!!errors.color}
                  type="text"
                  fullWidth
                  variant="standard"
                />
              )}
            />
            {errors.color && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.color.message}
              </FormHelperText>
            )}
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  margin="dense"
                  label="Loại sản phẩm"
                  type="text"
                  error={!!errors.type}
                  fullWidth
                  variant="standard"
                />
              )}
            />
            {errors.type && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.type.message}
              </FormHelperText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddProductDialog}>Huỷ bỏ</Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
};

export default ListProductsTable;

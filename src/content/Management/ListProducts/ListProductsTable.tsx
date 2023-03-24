import { FC, ChangeEvent, useState, useCallback, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Tooltip,
  Divider,
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
  Button,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import RemoveRedEyeOutlined from '@mui/icons-material/RemoveRedEyeOutlined';
import { IProduct } from '@/models/product';
import axiosInstance from '@/config/api';
import { Controller, useForm } from 'react-hook-form';

interface ListProductsTableProps {
  className?: string;
}

const RecentOrdersTable: FC<ListProductsTableProps> = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const selectedBulkActions = selectedProducts.length > 0;
  const [showImage, setShowImage] = useState<boolean>(false);
  // const [searchData, setSearchData] = useState<IProduct[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<IProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  //Add Dialog State
  const { control, handleSubmit, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      type: '',
      color: '',
      price: 0,
      image:
        'https://product.hstatic.net/1000096703/product/hma00111_0cb33baa0f554dcd872d415e861d0855_master.jpg'
    }
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [openAddProductDialog, setOpenAddProductDialog] =
    useState<boolean>(false);

  const handleCloseAddProductDialog = () => {
    reset();
    setOpenAddProductDialog(false);
    setImagePreview('');
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
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
    handleCloseAddProductDialog();
    console.log(data);
    axiosInstance({
      method: 'POST',
      url: 'v1/products',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      },
      data
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

  const handleSelectAllProducts = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedProducts(
      event.target.checked ? data.map((product) => product.id) : []
    );
  };

  const handleSelectOneProduct = (
    _event: ChangeEvent<HTMLInputElement>,
    productId: string
  ): void => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const selectedSomeProducts =
    selectedProducts.length > 0 && selectedProducts.length < data.length;
  const selectedAllProducts = selectedProducts.length === data.length;
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
                  onChange={(e) => handleSearch(e.target.value)}
                  label={'Search'}
                />
              </FormControl>
            </Box>
          </Box>
        </Box>
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllProducts}
                  indeterminate={selectedSomeProducts}
                  onChange={handleSelectAllProducts}
                />
              </TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Màu sắc</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((product) => {
              const isProductSelected = selectedProducts.includes(product.id);
              return (
                <TableRow hover key={product.id} selected={isProductSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isProductSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneProduct(event, product.id)
                      }
                      value={isProductSelected}
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
                          src={product.image}
                          alt={'Product image'}
                          width={'100%'}
                        />
                      ) : (
                        <img src={product.image} width={'150%'} />
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
              <img src={imagePreview} width={'100%'} />
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
                  variant="standard"
                />
              )}
            />
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
                  fullWidth
                  variant="standard"
                />
              )}
            />
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
                  type="text"
                  fullWidth
                  variant="standard"
                />
              )}
            />
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
                  fullWidth
                  variant="standard"
                />
              )}
            />
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

export default RecentOrdersTable;

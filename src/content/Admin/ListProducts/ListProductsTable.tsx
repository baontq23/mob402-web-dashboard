import { FC, ChangeEvent, useState, useCallback, useEffect } from 'react';
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
  useMediaQuery
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import RemoveRedEyeOutlined from '@mui/icons-material/RemoveRedEyeOutlined';
import { IProduct } from '@/models/product';
import axiosInstance from '@/config/api';
import { useRouter } from 'next/router';

interface ListProductsTableProps {}

const RecentOrdersTable: FC<ListProductsTableProps> = () => {
  const route = useRouter();
  const [showImage, setShowImage] = useState<boolean>(false);
  //const [searchData, setSearchData] = useState<IProduct[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<IProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handleSearch = (q: string) => {
    setSearchValue(q);
  };

  const handleGetData = useCallback(() => {
    axiosInstance({
      url: 'v1/admin/products',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      },
      params: {
        page: page + 1,
        limit,
        populate: 'user.name'
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

  const handleDeleteProduct = (id: string) => {
    axiosInstance({
      method: 'DELETE',
      url: 'v1/admin/products/' + id,
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

  return (
    <Card>
      <Box flex={1} p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <FormControl fullWidth variant="outlined">
            <TextField
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              label={'Search'}
            />
          </FormControl>
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
              <TableCell align="right">Người dùng</TableCell>
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
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {product.user.name}
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
    </Card>
  );
};

export default RecentOrdersTable;

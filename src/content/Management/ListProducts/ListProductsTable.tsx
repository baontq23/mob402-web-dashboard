import { FC, ChangeEvent, useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
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
import { IProduct } from '@/models/product';

interface ListProductsTableProps {
  className?: string;
  listProducts: IProduct[];
}

const RecentOrdersTable: FC<ListProductsTableProps> = ({ listProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const selectedBulkActions = selectedProducts.length > 0;

  const [searchData, setSearchData] = useState<IProduct[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<IProduct[]>(listProducts);
  const [total, setTotal] = useState<number>(listProducts.length);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  //Add Dialog State
  const [imagePreview, setImagePreview] = useState<string>('');
  const [openAddProductDialog, setOpenAddProductDialog] =
    useState<boolean>(false);

  const handleCloseAddProductDialog = () => {
    setOpenAddProductDialog(false);
    setImagePreview('');
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSearch = (q: string) => {
    setSearchValue(q);
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedProducts(
      event.target.checked
        ? listProducts.map((cryptoOrder) => cryptoOrder.id)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    _event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedProducts.includes(cryptoOrderId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, cryptoOrderId]);
    } else {
      setSelectedProducts((prevSelected) =>
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
    selectedProducts.length > 0 &&
    selectedProducts.length < listProducts.length;
  const selectedAllCryptoOrders =
    selectedProducts.length === listProducts.length;
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
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
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
              const isCryptoOrderSelected = selectedProducts.includes(
                product.id
              );
              return (
                <TableRow
                  hover
                  key={product.id}
                  selected={isCryptoOrderSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, product.id)
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
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.type}
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
                      {product.image}
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
                    <Tooltip title="Edit Order" arrow>
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
                    <Tooltip title="Delete Order" arrow>
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
      <Dialog
        fullScreen={fullScreen}
        open={openAddProductDialog}
        onClose={handleCloseAddProductDialog}
      >
        <DialogTitle>Thêm sản phẩm</DialogTitle>
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
          <TextField
            autoFocus
            margin="dense"
            label="Tên sản phẩm"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Đơn giá"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Màu sắc"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Loại sản phẩm"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProductDialog}>Huỷ bỏ</Button>
          <Button onClick={handleCloseAddProductDialog}>Thêm</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  listProducts: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  listProducts: []
};

export default RecentOrdersTable;

import { Typography, Grid } from '@mui/material';

const PageHeader = () => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Danh sách toàn bộ sản phẩm
        </Typography>
        <Typography variant="subtitle2">
          Quản lý các sản phẩm của các thành viên
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PageHeader;

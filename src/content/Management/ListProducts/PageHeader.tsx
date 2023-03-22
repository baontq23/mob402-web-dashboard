import { Typography, Grid } from '@mui/material';
const PageHeader = () => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Danh sách sản phẩm
        </Typography>
        <Typography variant="subtitle2">
          Bạn có thể quản lý sản phẩm của mình tại đấy
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PageHeader;

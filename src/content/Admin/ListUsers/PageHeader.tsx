import { Typography, Grid } from '@mui/material';

function PageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Danh sách người dùng
        </Typography>
        <Typography variant="subtitle2">Quản lý người dùng hệ thống</Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;

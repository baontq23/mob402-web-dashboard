import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import Text from '@/components/Text';
import Label from '@/components/Label';
import { useAuth } from '@/hook/useAuth';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import axiosInstance from '@/config/api';
import { useRouter } from 'next/router';
type Props = {};
const EditProfileTab: React.FC<Props> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useAuth();
  const route = useRouter();

  const handleSendEmail = () => {
    setLoading(true);
    axiosInstance({
      method: 'POST',
      url: '/v1/auth/send-verification-email',

      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
      .then((res) => {
        if (res.status === 204) {
          alert('Đã gửi email xác nhận. Vui lòng kiểm tra hòm thư!');
        } else {
          alert('Gửi email thất bại.');
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Máy chủ gửi thư không khả dụng. Vui lòng quay lại sau.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Thông tin cá nhân
              </Typography>
              <Typography variant="subtitle2">
                Quản lý thông tin, địa chỉ email
              </Typography>
            </Box>
            <Button
              onClick={() => route.push('profile/edit')}
              variant="text"
              startIcon={<EditTwoToneIcon />}
            >
              Chỉnh sửa
            </Button>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Họ tên:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>{auth.user.name}</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Email:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>{auth.user.email}</b>
                  </Text>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Xác thực email:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  {auth.user.isEmailVerified ? (
                    <Label color="success">
                      <DoneTwoToneIcon fontSize="small" />
                      <b>Verified</b>
                    </Label>
                  ) : (
                    <LoadingButton
                      loading={loading}
                      onClick={handleSendEmail}
                      startIcon={<CloseTwoToneIcon fontSize="small" />}
                      color="warning"
                    >
                      Gửi email xác thực
                    </LoadingButton>
                  )}
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  lineHeight: 1
                }}
                primary="Đổi mật khẩu"
                secondary="Bạn có thể đổi mật khẩu tại đây"
              />
              <Button
                onClick={() => route.push('profile/change-password')}
                size="large"
                variant="outlined"
              >
                Đổi mật khẩu
              </Button>
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EditProfileTab;

import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';

import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider
} from '@mui/material';
import Footer from 'src/components/Footer';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { LoadingButton } from '@mui/lab';
import { useAuth } from '@/hook/useAuth';
import axios from 'axios';

const EditProfile = () => {
  const router = useRouter();
  const auth = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      old_password: '',
      new_password: '',
      re_password: ''
    }
  });

  const onSubmit = async (data) => {
    if (data.new_password !== data.re_password) {
      alert('Mật khẩu nhập lại không trùng khớp');
      return;
    }

    axios({
      method: 'POST',
      baseURL: process.env.API_URL,
      url: 'v1/auth/change-password',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      },
      data: {
        email: auth.user.email,
        old_password: data.old_password,
        new_password: data.new_password
      }
    })
      .then((res) => {
        if (res.status === 204) {
          alert('Đổi mật khẩu thành công!');
          router.reload();
        } else {
          alert('Cập nhật thông tin thất bại!');
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 400) {
          alert('Thông tin không hợp lệ, vui lòng kiểm tra lại');
        } else if (e.response.status === 401) {
          alert('Mật khẩu cũ không chính xác!');
        } else {
          alert('Server error');
        }
      });
  };

  return (
    <>
      <Head>
        <title>Đổi mật khẩu</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle heading="Đổi mật khẩu" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Mật khẩu bao gồm chữ hoa và chữ số" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': {
                      marginRight: 1,
                      marginTop: 1,
                      marginBottom: 1
                    }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <Controller
                      name="old_password"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          autoFocus
                          margin="dense"
                          label="Mật khẩu cũ"
                          type="password"
                          fullWidth
                          error={!!errors.old_password}
                        />
                      )}
                    />
                    <Controller
                      name="new_password"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          autoFocus
                          margin="dense"
                          label="Mật khẩu mới"
                          type="password"
                          fullWidth
                          error={!!errors.new_password}
                        />
                      )}
                    />
                    <Controller
                      name="re_password"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          margin="dense"
                          label="Nhập lại mật khẩu"
                          error={!!errors.re_password}
                          type="password"
                          fullWidth
                        />
                      )}
                    />

                    <LoadingButton type="submit" fullWidth variant="contained">
                      Cập nhật
                    </LoadingButton>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

EditProfile.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default EditProfile;

import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';
import { ChangeEvent, useEffect, useState } from 'react';

import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import Footer from 'src/components/Footer';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import axiosInstance from '@/config/api';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

const EditProduct = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [currentImage, setCurrentImage] = useState<string>('');
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      role: '',
      isEmailVerified: 'false'
    }
  });

  useEffect(() => {
    axiosInstance({
      url: 'v1/users/' + userId,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
      .then((res) => {
        setValue('name', res.data.name);
        setValue('email', res.data.email);
        setValue('role', res.data.role);
        setValue('isEmailVerified', res.data.isEmailVerified + '');
        setCurrentImage(res.data.avatar_link);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const [imagePreview, setImagePreview] = useState<File>(null);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    setImagePreview(e.target.files[0]);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('role', data.role);
    formData.append('isEmailVerified', data.isEmailVerified);
    imagePreview &&
      formData.append('avatar', imagePreview, Date.now() + imagePreview.name);

    axiosInstance({
      method: 'PATCH',
      url: 'v1/admin/users/' + userId,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .then((res) => {
        if (res.status === 200) {
          alert('Cập nhật thông tin thành công!');
          router.back();
        } else {
          alert('Cập nhật thông tin thất bại!');
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 400) {
          alert('Thông tin không hợp lệ, vui lòng kiểm tra lại');
        } else {
          alert('Server error');
        }
      });
  };
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
    <>
      <Head>
        <title>Chỉnh sửa thông tin</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle heading="Chỉnh sửa thông tin" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Cập nhật thông tin" />
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
                    <ImageWrapper
                      sx={{ width: '30%', m: currentImage ? 0 : 5 }}
                    >
                      <img
                        src={
                          imagePreview
                            ? URL.createObjectURL(imagePreview)
                            : currentImage
                        }
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
                        />
                      )}
                    />
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
                          error={!!errors.email}
                          type="email"
                          fullWidth
                        />
                      )}
                    />
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <FormControl fullWidth>
                          <InputLabel>Quyền</InputLabel>
                          <Select
                            value={value}
                            label="Quyền"
                            onChange={onChange}
                            onBlur={onBlur}
                          >
                            <MenuItem value={'admin'}>Admin</MenuItem>
                            <MenuItem value={'user'}>User</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                    <Controller
                      name="isEmailVerified"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Xác nhận email</InputLabel>
                          <Select
                            value={value}
                            label="Xác nhận email"
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!errors.isEmailVerified}
                          >
                            <MenuItem value={'false'}>Chưa xác nhận</MenuItem>
                            <MenuItem value={'true'}>Đã xác nhận</MenuItem>
                          </Select>
                        </FormControl>
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

EditProduct.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default EditProduct;

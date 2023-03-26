import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton
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
  const { productId } = router.query;
  const [currentImage, setCurrentImage] = useState<string>('');
  const { control, handleSubmit, setValue } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      type: '',
      color: '',
      price: 0
    }
  });

  useEffect(() => {
    axiosInstance({
      url: 'v1/products/' + productId,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
      .then((res) => {
        setValue('name', res.data.name);
        setValue('color', res.data.color);
        setValue('type', res.data.type);
        setValue('price', res.data.price);
        setCurrentImage(res.data.image_link);
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
    formData.append('type', data.type);
    formData.append('color', data.color);
    formData.append('price', data.price);
    imagePreview &&
      formData.append('image', imagePreview, Date.now() + imagePreview.name);

    axiosInstance({
      method: 'PATCH',
      url: 'v1/products/' + productId,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .then((res) => {
        if (res.status === 200) {
          alert('Cập nhật sản phẩm thành công!');
          router.back();
        } else {
          alert('Cập nhật sản phẩm thất bại!');
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Server error');
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
        <title>Chỉnh sửa sản phẩm</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle heading="Chỉnh sửa sản phẩm" />
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
                    <ImageWrapper>
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
                          label="Tên sản phẩm"
                          type="text"
                          fullWidth
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

EditProduct.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default EditProduct;

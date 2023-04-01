import {
  Box,
  Typography,
  Card,
  Avatar,
  CardMedia,
  IconButton,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { ChangeEvent, useState } from 'react';
import axiosInstance from '@/config/api';
import { useRouter } from 'next/router';
import { useAuth } from '@/hook/useAuth';

const Input = styled('input')({
  display: 'none'
});

const AvatarWrapper = styled(Card)(
  ({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

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

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const ProfileCover = () => {
  const auth = useAuth();
  const router = useRouter();
  const [avatar, setAvatar] = useState<File>(null);
  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target.files[0]);
  };
  const onSubmit = (data) => {
    const formData = new FormData();
    data.name && formData.append('name', data.name);
    data.email && formData.append('email', data.email);
    data.password && formData.append('password', data.password);
    avatar && formData.append('avatar', avatar, Date.now() + avatar.name);

    axiosInstance({
      method: 'PATCH',
      url: 'v1/users/' + auth.user.id,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .then((res) => {
        if (res.status === 200) {
          alert('Cập nhật thông tin thành công!');
          router.reload();
        } else {
          alert('Cập nhật thông tin thất bại!');
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Server error');
      });
  };
  return (
    <>
      <CardCover>
        <CardMedia image={'/static/images/placeholders/covers/5.jpg'} />
      </CardCover>
      <AvatarWrapper>
        <Avatar
          variant="rounded"
          alt={auth.user.name}
          src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar_link}
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
        {avatar && <Button onClick={onSubmit}>Xác nhận</Button>}
      </AvatarWrapper>
      <Box py={2} pl={2} mb={3}>
        <Typography gutterBottom variant="h4">
          {auth.user.name}
        </Typography>

        <Typography sx={{ py: 2 }} variant="subtitle2" color="text.primary">
          {auth.user.role}
        </Typography>
      </Box>
    </>
  );
};

export default ProfileCover;

import {
  Box,
  Typography,
  Container,
  Divider,
  IconButton,
  Tooltip,
  styled,
  Grid,
  FormControl,
  TextField,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import { ReactElement, useState } from 'react';
import BaseLayout from '@/layouts/BaseLayout';

import Head from 'next/head';

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GithubIcon from '@mui/icons-material/GitHub';
import EyeOutline from '@mui/icons-material/RemoveRedEyeOutlined';
import EyeOffOutline from '@mui/icons-material/RemoveRedEyeRounded';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '@/hook/useAuth';
import Link from '@/components/Link';
const MainContent = styled(Box)(
  () => `
      height: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
  `
);

const TopWrapper = styled(Box)(
  () => `
    display: flex;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
  `
);
const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().min(5).required()
});

function AuthLogin() {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  //const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',

    defaultValues: {
      email: 'baontq23@gmail.com',
      password: 'Bao03072003'
    }
  });
  const onSubmit = (data) => {
    setLoading(true);
    setTimeout(() => {
      auth.login(data, () => {
        setError('email', { message: 'Thông tin đăng nhập không chính xác!' });
        setLoading(false);
      });
    }, 1);
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center">
              <Container maxWidth="xs">
                <Typography variant="h2" sx={{ mb: 2 }}>
                  Login
                </Typography>
              </Container>
              <Grid container justifyContent={'center'}>
                <Grid item>
                  <form
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="email"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            label="Email or username"
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.email)}
                            placeholder="abc@domain"
                          />
                        )}
                      />
                      {errors.email && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.email.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="auth-login-v2-password"
                        error={Boolean(errors.password)}
                      >
                        Password
                      </InputLabel>
                      <Controller
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <OutlinedInput
                            value={value}
                            onBlur={onBlur}
                            label="Password"
                            onChange={onChange}
                            id="auth-login-v2-password"
                            error={Boolean(errors.password)}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOutline />
                                  ) : (
                                    <EyeOffOutline />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        )}
                      />
                      {errors.password && (
                        <FormHelperText sx={{ color: 'error.main' }} id="">
                          {errors.password.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      loading={isLoading}
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Login
                    </LoadingButton>
                  </form>
                  <Link href={'/auth/register'}>Đăng ký</Link>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography component="span" variant="subtitle1">
                  Phone:{' '}
                </Typography>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.primary"
                >
                  + 84 395 250 686
                </Typography>
              </Box>
              <Box>
                <Tooltip arrow placement="top" title="Facebook">
                  <IconButton
                    href="https://facebook.com/trieubaoit"
                    color="primary"
                  >
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Twitter">
                  <IconButton
                    href="https://twitter.com/baontq23"
                    color="primary"
                  >
                    <TwitterIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Github">
                  <IconButton
                    href="https://github.com/baontq23"
                    color="primary"
                  >
                    <GithubIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default AuthLogin;

AuthLogin.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

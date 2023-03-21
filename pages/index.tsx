import { Box, CircularProgress } from '@mui/material';
import { ReactElement, useEffect } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import { useRouter } from 'next/router';

function Overview() {
  const router = useRouter();
  useEffect(() => {
    router.replace('auth/login');
  }, []);
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress disableShrink />
    </Box>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

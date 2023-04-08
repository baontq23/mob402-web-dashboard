import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';

import { Grid, Container } from '@mui/material';

import ProfileCover from '@/content/Management/Users/details/ProfileCover';
import EditProfileTab from '@/content/Management/Users/details/EditProfileTab';
import { useAuth } from '@/hook/useAuth';

function ManagementUserProfile() {
  const auth = useAuth();

  return (
    <>
      <Head>
        <title>{auth.user.name}</title>
      </Head>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={12}>
            <ProfileCover />
          </Grid>
          <Grid item xs={12} md={12}>
            <EditProfileTab />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;

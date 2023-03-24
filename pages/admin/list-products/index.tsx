import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Admin/ListProducts/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container, Card } from '@mui/material';
import Footer from '@/components/Footer';

import ListProductsTable from '@/content/Admin/ListProducts/ListProductsTable';

function ApplicationsTransactions() {
  return (
    <>
      <Head>
        <title>Danh sách sản phẩm </title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <ListProductsTable />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsTransactions.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsTransactions;

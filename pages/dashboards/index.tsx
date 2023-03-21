import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Dashboards/PageHeader';
import Footer from '@/components/Footer';

import PageTitleWrapper from '@/components/PageTitleWrapper';

const DashboardOverview = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Footer />
    </>
  );
};

DashboardOverview.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DashboardOverview;

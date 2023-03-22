import { Card } from '@mui/material';

import ListProductsTable from './ListProductsTable';
import { IProduct } from '@/models/product';

function ListProducts() {
  const dummyData: IProduct[] = [
    {
      id: '1',
      name: 'Quần',
      image: 'Link ảnh',
      color: 'Đỏ',
      price: 34.4565,
      type: 'mẫu',
      user: {
        email: 'dsdsd',
        name: 'Bao',
        id: 'dsd'
      }
    },
    {
      id: '2',
      name: 'Áo',
      image: 'Link ảnh',
      color: 'Trắng',
      price: 34.4565,
      type: 'ds',
      user: {
        email: 'dsdsd',
        name: 'Bao',
        id: 'dsd'
      }
    }
  ];

  return (
    <Card>
      <ListProductsTable listProducts={dummyData} />
    </Card>
  );
}

export default ListProducts;

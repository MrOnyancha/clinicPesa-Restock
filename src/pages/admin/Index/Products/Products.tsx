import React, { useEffect } from 'react';
import { useTDispatch, useTSelector } from '@/store/hooks';
import { productList } from './productsSlice';

import { ProductsTable } from './ProductsTable';
import { columns } from './columns';

const Products: React.FC = () => {
  const dispatch = useTDispatch();
  const products = useTSelector((state) => state.products.products);
  // const isLoading = useTSelector((state) => state.products.isLoading);

  useEffect(() => {
    dispatch(productList({ filterBy: 'NAME', page: 0, max: 50 }));
  }, [dispatch]);

  return (
    <React.Fragment>
      <section className="section">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="section-heading">Products</h4>
        </div>
        <hr />

        <div className="mb-4">
          <ProductsTable data={products} columns={columns} />
        </div>
      </section>
    </React.Fragment>
  );
};

export default Products;

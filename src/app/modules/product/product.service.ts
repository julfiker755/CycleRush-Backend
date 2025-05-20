import QueryBuilder from '../../builder/queryBuilder';
import { productModel } from './product.model';


const productGetBD=async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(productModel.find(), query)
    .filter()
    .paginate()
    .sort();
  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();
  return {
    result,
    meta,
  };
};



export const productService = {
  productGetBD
};

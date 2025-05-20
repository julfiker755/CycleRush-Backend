import QueryBuilder from '../../builder/queryBuilder';
import { Tproduct } from './product.interface';
import { productModel } from './product.model';


// productGetBD
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


// productStoreBD
const productStoreBD=async (payload:Partial<Tproduct>) => {
  console.log(payload)
};



export const productService = {
  productGetBD,
  productStoreBD
};

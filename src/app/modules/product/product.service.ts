import { sendImageToCloudinary } from '../../../ulits/sendImageToCloudinary';
import QueryBuilder from '../../builder/queryBuilder';
import { Tproduct } from './product.interface';
import { productModel } from './product.model';


// productGetBD
const productGetBD=async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(productModel.find(), query)
    .filter()
    .paginate()
    .search(["name"])
    .sort();
  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();
  return {
    result,
    meta,
  };
};


// productStoreBD
const productStoreBD=async (payload:Partial<Tproduct>,file:any) => {
  if (file && file?.length > 0) {
    const imgUrls: string[] = [];
    for (const el of file) {
      const imageName = Math.random().toString(36).slice(2);
      const path = el?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      imgUrls.push(secure_url as string);
    }
    Object.assign(payload, { images: imgUrls });
  }
  const result=await productModel.create(payload)
  return result
};

// single product
const singleProductBD=async (id:string) => {
  const result=await productModel.findById(id)
  return result
};

// delete product
const deleteProductBD=async (id:string) => {
  const result=await productModel.findByIdAndDelete(id)
  return result
};


export const productService = {
  productGetBD,
  productStoreBD,
  singleProductBD,
  deleteProductBD
};

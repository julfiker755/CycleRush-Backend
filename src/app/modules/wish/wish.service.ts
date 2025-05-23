import QueryBuilder from '../../builder/queryBuilder';
import { userModel } from '../user/user.model';
import { Twish } from './wish.interface';
import { wishModel } from './wish.model';

// wishGetBD
const wishGetBD = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(wishModel.find(), query)
    .paginate()
    .sort();
  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();
  return {
    result,
    meta,
  };
};

// wishStoreBD
const wishStoreBD = async (payload: Partial<Twish>) => {
  const userInfo = await userModel.findOne({ email:payload.email });
  if (!userInfo) throw new Error('user not found');
  const isExist = await wishModel.findOne(payload)
  if (isExist) throw new Error('Already added to wishlist');
  const result = await wishModel.create(payload);
  return result;
};

export const wishService = {
  wishStoreBD,
  wishGetBD,
};

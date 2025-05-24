import QueryBuilder from '../../builder/queryBuilder';
import { Tuser } from '../user/user.interface';
import { userModel } from '../user/user.model';
import { Twish } from './wish.interface';
import { wishModel } from './wish.model';

// wishGetBD
const wishGetBD = async (
  query: Record<string, unknown>,
  user: Partial<Tuser>,
) => {
  const adminQuery = new QueryBuilder(
    wishModel
      .find({ email: user.email })
      .populate("wishId")
      .select('-email')
      .lean(),
    query,
  )
    .paginate()
    .sort();
  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();

  const result2= result.map((item) => {
    const { _id:wishId, ...wishData } = item.wishId || {};
    return {
      _id: item._id,
      wishId,
      ...wishData,
    };
  });
  
  return {
    result: result2,
    meta,
  };
};

// wishStoreBD
const wishStoreBD = async (payload: Partial<Twish>,user:Tuser) => {
  const wishPayload ={
    ...payload,
    email: user.email,
  };
  const userInfo = await userModel.findOne({ email:user.email });
  if (!userInfo) throw new Error('user not found');
  const isExist = await wishModel.findOne(wishPayload);
  if (isExist) throw new Error('Already added to wishlist');
  const result = await wishModel.create(wishPayload);
  return result;
};

// deleteWish
const deleteWishBD = async (id: string) => {
  const result = await wishModel.findByIdAndDelete(id);
  return result;
};

export const wishService = {
  wishStoreBD,
  wishGetBD,
  deleteWishBD,
};

// const studentQuery = new QueryBuilder(
//   StudentModel.find()
//     .populate('admissionSemester')
//     .populate({
//       path: 'academicDeparment',
//       populate: {
//         path: 'academicFaculty',
//       },
//     }),
//   query,
// )

import QueryBuilder from '../../builder/queryBuilder';
import { Tuser } from '../user/user.interface';
import { userModel } from '../user/user.model';
import { Tcart } from './cart.interface';
import { cartModel } from './cart.model';


// wishGetBD
const cartGetBD = async (
  query: Record<string, unknown>,
  user: Partial<Tuser>,
) => {
  const adminQuery = new QueryBuilder(
    cartModel
      .find({ email: user.email })
      .populate({path:'productId',select:'-description -images'})
      .select('-email')
      .lean(),
    query,
  )
    .paginate()
    .sort();
  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();

  const result2= result.map((item:any) => {
    const { _id:productId,price, ...cartData } = item.productId || {};
    return {
      _id: item._id,
      productId,
      quantity:item.quantity,
      price,
      totalPrice:item.quantity*price,
      ...cartData,
    };
  });
  
  return {
    result:result2,
    meta,
  };
};

// increment
const incrementCartDB = async (id: string) => {
  const result = await cartModel.findByIdAndUpdate(
    id,
    { $inc: { quantity: 1 } },
    { new: true },
  );
  return result;
};

// decrement
const decrementCartDB = async (id: string) => {
  const result = await cartModel.findByIdAndUpdate(
    { _id: id, quantity: { $gt: 1 } },
    { $inc: { quantity: -1 } },
    { new: true },
  );
  return result;
};

// wishStoreBD
const cartStoreBD = async (payload:Partial<Tcart>,user:Tuser) => {
  const cartPayload ={
    ...payload,
    quantity:1,
    email: user.email,
  };
  const userInfo = await userModel.findOne({ email:user.email });
  if (!userInfo) throw new Error('user not found');
  const isExist = await cartModel.findOne({
    email: user.email,
    productId: payload.productId,
  });
  if (isExist) throw new Error('Already added to cart product');
  const result = await cartModel.create(cartPayload);
  return result;
};


// deleteWish
const deleteCartBD = async (id: string) => {
  const result = await cartModel.findByIdAndDelete(id);
  return result;
};

export const cartService = {
  cartStoreBD,
  cartGetBD,
  deleteCartBD,
  incrementCartDB,
  decrementCartDB
};



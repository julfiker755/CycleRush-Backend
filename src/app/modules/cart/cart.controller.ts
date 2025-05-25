import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import { cartService } from './cart.service';


const cartGetBD = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const results = await cartService.cartGetBD(req.query, req.user);
    const { result, meta }: any = results;
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart Info succesfully',
      meta: meta,
      data: result,
    });
  },
);

const incrementCartDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await cartService.incrementCartDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Increment succesfully',
    data: result,
  });
});

const decrementCartDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await cartService.decrementCartDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Decrement succesfully',
    data: result,
  });
});

const cartStoreBD = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await cartService.cartStoreBD(req.body, req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart Store succesfully',
      data: result,
    });
  },
);

const deleteCartBD = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await cartService.deleteCartBD(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Delete succesfully',
    data: result,
  });
});

export const cartController = {
  cartGetBD,
  cartStoreBD,
  deleteCartBD,
  incrementCartDB,
  decrementCartDB
};

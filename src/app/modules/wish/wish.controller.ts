import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import { wishService } from "./wish.service";




const wishGetBD = catchAsync(async (req: Request & {user?:any}, res: Response) => {
    const results = await wishService.wishGetBD(req.query,req.user)
    const {result,meta}:any=results
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wish Info succesfully',
      meta:meta,
      data: result,
    });
  });

const wishStoreBD = catchAsync(async (req: Request, res: Response) => {
    const result = await wishService.wishStoreBD(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wish Store succesfully',
      data: result,
    });
  });

const deleteWishBD = catchAsync(async (req: Request, res: Response) => {
  const {id}=req.params
    const result = await wishService.deleteWishBD(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wish Delete succesfully',
      data: result,
    });
  });


  export const wishController = {
    wishGetBD,
    wishStoreBD,
    deleteWishBD
  };
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import { wishService } from "./wish.service";




const wishGetBD = catchAsync(async (req: Request, res: Response) => {
    const results = await wishService.wishGetBD(req.query)
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



  
  export const wishController = {
    wishGetBD,
    wishStoreBD
  };
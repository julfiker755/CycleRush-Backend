import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import { productService } from "./product.service";



const productGetBD = catchAsync(async (req: Request, res: Response) => {
    const results = await productService.productGetBD(req.query)
    const {result,meta}:any=results
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product Info succesfully',
      meta:meta,
      data: result,
    });
  });

  
  export const productController = {
    productGetBD
  };
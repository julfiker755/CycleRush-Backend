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

const productStoreBD = catchAsync(async (req: Request, res: Response) => {
    const result = await productService.productStoreBD(req.body,req.files)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Products Store succesfully',
      data: result,
    });
  });

const singleProductBD = catchAsync(async (req: Request, res: Response) => {
    const result = await productService.singleProductBD(req.params.id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Products Info succesfully',
      data: result,
    });
  });

const deleteProductBD= catchAsync(async (req: Request, res: Response) => {
    const result = await productService.deleteProductBD(req.params.id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product delete succesfully',
      data: result,
    });
  });

  
  export const productController = {
    productGetBD,
    productStoreBD,
    singleProductBD,
    deleteProductBD
  };
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { adminService } from "./admin.serviec";
import httpStatus from 'http-status';



const adminGetBD = catchAsync(async (req: Request, res: Response) => {
    const results = await adminService.adminGetBD(req.query)
    const {result,meta}:any=results
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Info succesfully',
      meta:meta,
      data: result,
    });
  });
  
const adminStoreBD = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.adminStoreBD(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin store succesfully',
      data: result,
    });
  });
  
const adminGetByIdBD = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.adminGetByIdBD(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Single succesfully',
      data: result,
    });
  });

const adminUpdate = catchAsync(async (req: Request & {user:any}, res: Response) => {
    const user=req.user
    const result = await adminService.adminUpdateByIdBD(req.body,user)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Update succesfully',
      data: result,
    });
  });

const adminDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.adminDeleteByIdBD(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Delete succesfully',
      data:result,
    });
  });
  
  
  export const adminController = {
    adminStoreBD,
    adminGetBD,
    adminGetByIdBD,
    adminUpdate,
    adminDelete
  };
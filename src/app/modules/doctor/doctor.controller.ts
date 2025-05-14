import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorService } from "./doctor.service";
import httpStatus from 'http-status';


const doctorGetBD = catchAsync(async (req: Request, res: Response) => {
    const results = await doctorService.doctorGetBD(req.query)
    const {result,meta}:any=results
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor Info succesfully',
      meta:meta,
      data:result,
    });
  });
const dcotorStoreBD = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorService.doctorStoreBD(req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor store succesfully',
      data: result,
    });
  });

  const doctorGetByIdBD = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorService.doctorGetByIdBD(req.params.id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor Single Info succesfully',
      data: result,
    });
  })

  const doctorUpdateBD = catchAsync(async (req: Request & {user:any}, res: Response) => {
    const user=req.user
    const result = await doctorService.doctorUpdateByIdBD(req.body,user)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor Update Info succesfully',
      data: result,
    });
  })    
  const doctorDeleteByIdBD  = catchAsync(async (req: Request, res: Response) => {
    const {id}=req.params
    const result = await doctorService.doctorDeleteByIdBD(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor Delete succesfully',
      data: result,
    });
  })    


    
  export const doctorController = {
    doctorGetBD ,
    dcotorStoreBD,
    doctorGetByIdBD,
    doctorUpdateBD,
    doctorDeleteByIdBD 
  };
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import {patientService } from "./patient.service";
import httpStatus from 'http-status';


const patientGetBD = catchAsync(async (req: Request, res: Response) => {
    const results= await patientService.patientGetBD(req.query)
    const {result,meta}:any=results
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Patient Info succesfully',
      meta:meta,
      data: result,
    });
  });
const patientStoreBD = catchAsync(async (req: Request, res: Response) => {
    const result = await patientService.patientStoreBD(req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Patient store succesfully',
      data: result,
    });
  });

  const patientGetByIdBD = catchAsync(async (req: Request, res: Response) => {
    const result = await patientService.patientGetByIdBD(req.params.id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Patient Single Info succesfully',
      data: result,
    });
  })

  const patientUpdateBD = catchAsync(async (req: Request & {user:any}, res: Response) => {
    const user=req.user
    const result = await patientService.patientUpdateByIdBD(req.body,user)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Patient Update Info succesfully',
      data: result,
    });
  })    
  const patientDeleteByIdBD  = catchAsync(async (req: Request, res: Response) => {
    const {id}=req.params
    const result = await patientService.patientDeleteByIdBD(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Patient Delete succesfully',
      data: result,
    });
  })    


    
  export const patientController = {
    patientGetBD,
    patientStoreBD,
    patientGetByIdBD,
    patientUpdateBD,
    patientDeleteByIdBD
  };
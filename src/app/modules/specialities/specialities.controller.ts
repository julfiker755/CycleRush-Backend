import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import { specialitieService } from "./specialities.service";


const specialitieGetBD = catchAsync(async (req: Request, res: Response) => {
    const results= await specialitieService.specialitieGetBD(req.query)
    const {result,meta}:any=results
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Specialitie Info succesfully',
      meta:meta,
      data: result,
    });
  });
 


    
  export const specialitieController = {
    specialitieGetBD
  };
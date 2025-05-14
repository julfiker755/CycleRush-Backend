import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import { userService } from './user.service';



const UserGetBD= catchAsync(async (req: Request, res: Response) => {
  const results= await userService.UserGetBD(req.query)
  const {result,meta}:any=results
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Info succesfully',
    meta:meta,
    data: result,
  });
});

const loginUser= catchAsync(async (req: Request, res: Response) => {
  const result = await userService.loginUserBD(req.body)
  const {refreshToken,accessToken,needsPasswordChange}=result
  res.cookie('accessToken', accessToken, {
    secure: config.node_env  === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Login  succesfully',
    data: {
      refreshToken,
      needsPasswordChange,
    },
  });
});


export const userController = {
  UserGetBD,
  loginUser
};

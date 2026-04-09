import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AccessRequestServices } from './accessRequest.service';

const createAccessRequest = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await AccessRequestServices.createAccessRequestIntoDB({
    ...req.body,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access request created successfully',
    data: result,
  });
});

const getMyAccessRequests = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await AccessRequestServices.getMyAccessRequestsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access requests retrieved successfully',
    data: result,
  });
});

const getAllAccessRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await AccessRequestServices.getAllAccessRequestsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All access requests retrieved successfully',
    data: result,
  });
});

const updateAccessRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await AccessRequestServices.updateAccessRequestStatusInDB(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access request status updated successfully',
    data: result,
  });
});

const deleteAccessRequest = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id } = req.params;
  const result = await AccessRequestServices.deleteAccessRequestFromDB(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access request deleted successfully',
    data: result,
  });
});

export const AccessRequestControllers = {
  createAccessRequest,
  getMyAccessRequests,
  getAllAccessRequests,
  updateAccessRequestStatus,
  deleteAccessRequest,
};

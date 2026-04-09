import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnquiryService } from './enquiry.service';

const createEnquiry = catchAsync(async (req, res) => {
  const result = await EnquiryService.createEnquiryIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enquiry submitted successfully',
    data: result,
  });
});

const getAllEnquiries = catchAsync(async (req, res) => {
  const result = await EnquiryService.getAllEnquiriesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enquiries retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateEnquiryStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await EnquiryService.updateEnquiryStatusInDB(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enquiry status updated successfully',
    data: result,
  });
});

const deleteEnquiry = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EnquiryService.deleteEnquiryFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enquiry deleted successfully',
    data: result,
  });
});

export const EnquiryController = {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};

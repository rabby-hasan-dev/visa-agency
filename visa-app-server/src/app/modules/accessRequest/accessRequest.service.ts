import { TAccessRequest } from './accessRequest.interface';
import { AccessRequest } from './accessRequest.model';

const createAccessRequestIntoDB = async (payload: TAccessRequest) => {
  const result = await AccessRequest.create(payload);
  return result;
};

const getMyAccessRequestsFromDB = async (userId: string) => {
  const result = await AccessRequest.find({ userId }).sort('-requestDate');
  return result;
};

const getAllAccessRequestsFromDB = async () => {
  const result = await AccessRequest.find()
    .populate('userId')
    .sort('-requestDate');
  return result;
};

const updateAccessRequestStatusInDB = async (
  id: string,
  status: string,
) => {
  const result = await AccessRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );
  return result;
};

const deleteAccessRequestFromDB = async (id: string, userId: string) => {
  const result = await AccessRequest.findOneAndDelete({ _id: id, userId });
  return result;
};

export const AccessRequestServices = {
  createAccessRequestIntoDB,
  getMyAccessRequestsFromDB,
  getAllAccessRequestsFromDB,
  updateAccessRequestStatusInDB,
  deleteAccessRequestFromDB,
};

import { TEnquiry } from './enquiry.interface';
import { Enquiry } from './enquiry.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createEnquiryIntoDB = async (payload: TEnquiry) => {
  const result = await Enquiry.create(payload);
  return result;
};

const getAllEnquiriesFromDB = async (query: Record<string, unknown>) => {
  const enquiryQuery = new QueryBuilder(Enquiry.find(), query)
    .search(['name', 'email', 'subject', 'message'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enquiryQuery.modelQuery;
  const meta = await enquiryQuery.countTotal();

  return {
    meta,
    result,
  };
};

const updateEnquiryStatusInDB = async (id: string, status: string) => {
  const result = await Enquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );
  return result;
};

const deleteEnquiryFromDB = async (id: string) => {
  const result = await Enquiry.findByIdAndDelete(id);
  return result;
};

export const EnquiryService = {
  createEnquiryIntoDB,
  getAllEnquiriesFromDB,
  updateEnquiryStatusInDB,
  deleteEnquiryFromDB,
};

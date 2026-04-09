import httpStatus from "../config/httpStatus";


export const sendNotFoundResponse = (label: string) => {
  return {
    statusCode: httpStatus.OK,
    success: false,
    message: `  ${label} `,
    data: null,
  };
};

// export const USER_API_END_POINT="http://localhost:5000/api/v1/user";
// export const JOB_API_END_POINT="http://localhost:5000/api/v1/job";
// export const APPLICATION_API_END_POINT="http://localhost:5000/api/v1/application";
// export const COMPANY_API_END_POINT="http://localhost:5000/api/v1/company";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

export const USER_API_END_POINT = `${BACKEND_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BACKEND_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BACKEND_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BACKEND_URL}/api/v1/company`;
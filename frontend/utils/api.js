// src/utils/api.js
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API = {
  REGISTER: `${baseURL}/api/register`,
  LOGIN: `${baseURL}/api/login`,
  PROFILE: `${baseURL}/api/profile`,
  UPDATE_PROFILE: `${baseURL}/api/update-profile`, // Endpoint untuk update profil
  UPDATE_PASSWORD: `${baseURL}/api/update-password`, // Endpoint untuk update password
  DELETE_ACCOUNT: `${baseURL}/api/delete-account`, // Endpoint untuk menghapus akun
};

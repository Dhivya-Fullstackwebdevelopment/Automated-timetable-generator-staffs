// src/api/staffApi.ts

import axios from "axios";
import { BASE_URL } from "./apiurl";

// staffApi.ts
export const getStaffFullTimetable = (staffId: number, semester?: string) => {
  const params = semester ? `?semester=${semester}` : "";
  return axios.get(`${BASE_URL}/api/timetable/staff-full-timetable/${staffId}/${params}`);
};
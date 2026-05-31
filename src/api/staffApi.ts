// src/api/staffApi.ts

import axios from "axios";
import { BASE_URL } from "./apiurl";

export const getStaffFullTimetable = async (
  staffId: number
) => {
  return axios.get(
    `${BASE_URL}/api/timetable/staff-full-timetable/${staffId}/`
  );
};
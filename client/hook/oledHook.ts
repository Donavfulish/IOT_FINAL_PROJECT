import { api } from "@/lib/axios";


export const useGetOled = async (id: string) => {
  try {
    const result = await api.get(`/device/oled/${id}`);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const useUpdateOled = async (payload: {
  id: string;
  message: string;
}) => {
  try {
    const result = await api.patch(`/device/oled/`, payload);
    return result;
  } catch (error) {
    console.log(error);
  }
};

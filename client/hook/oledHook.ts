import { api } from "@/lib/axios";

export const useGetOled = async (id: number | undefined) => {
  if (!id) return;

  try {
    const result = await api.get(`device/oled/${id}`);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const useUpdateOled = async (payload: {
  id: number | undefined;
  message: string;
}) => {
  if (!payload.id) return;
  try {
    const result = await api.patch(`device/oled`, payload);
    return result;
  } catch (error) {
    console.log(error);
  }
};

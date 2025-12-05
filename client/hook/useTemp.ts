import { api } from "@/lib/axios";

export const useGetTempInHour = async (id: string) => {
  try {
    const result = await api.get(`/device/temp/${id}/hour`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

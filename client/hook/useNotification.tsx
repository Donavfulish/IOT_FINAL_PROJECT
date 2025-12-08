import { api } from "@/lib/axios";

export const useGetEvenLogs = async (id: number) => {
  try {
    const result = await api.get(`/device/event-log/${id}`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const useGetSystemAlerts = async (id: number) => {
  try {
    const result = await api.get(`/device/system-alert/${id}`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

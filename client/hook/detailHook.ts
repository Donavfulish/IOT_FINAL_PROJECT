import { api } from "@/lib/axios";

export type AlertType = {
  title: string;
  message: string;
  time_at: Date;
};

export type BinDetailType = {
  id: number;
  battery: number;
  fill_level: number;
  is_display_fill: boolean;
  message: string;
  led_mode: "auto" | "manual";
  time_on_led: string;
  time_off_led: string;
  alerts: AlertType[];
};

export const useBinDetailById = async (
  id: number
): Promise<AlertType | undefined> => {
  if (!id) return undefined;

  try {
    const res = await api.get(`/api/bin/${id}`);
    return res.data;
  } catch (e) {
    console.error("Login failed: ", e);
    return undefined;
  }
};

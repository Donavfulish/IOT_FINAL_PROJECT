import { api } from "@/lib/axios";

export type AlertType = {
  title: string;
  message: string;
  time_at: Date;
};

export type BinPreview = {
  id: number;
  battery: number;
  fill_level: number;
  is_display_fill: boolean;
  message: string;
  led_mode: "auto" | "manual";
  time_on_led: string;
  time_off_led: string;
};

export type BinDetailType = BinPreview & {
  alerts: AlertType[];
};

export const useAllBins = async (): Promise<BinPreview[] | undefined> => {
  try {
    const res = await api.get(`/bin`);
    return res.data;
  } catch (e) {
    console.error("Login failed: ", e);
    return undefined;
  }
};

export const useBinDetailById = async (
  id: number
): Promise<BinDetailType | undefined> => {
  if (!id) return undefined;
  try {
    const res = await api.get(`/bin/${id}`);
    return res.data;
  } catch (e) {
    console.error("Login failed: ", e);
    return undefined;
  }
};

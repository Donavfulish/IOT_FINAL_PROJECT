import { api } from "@/lib/axios";

export const useUpdateLed = async (payload: {
    id: string | number;
    led_mode: "auto" | "manual";
    time_on_led: string;
    time_off_led: string;
    is_led_on: boolean;
}) => {
    try {
        const result = await api.patch(`device/led`, payload);
        return result;
    } catch (error) {
        console.log("Error updating LED:", error);
        throw error;
    }
};
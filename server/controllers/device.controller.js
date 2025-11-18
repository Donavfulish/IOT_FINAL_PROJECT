import { sendCommandToDevice } from "../services/device.service.js";

export const openLid = (req, res) => {
  try {
    const result = sendCommandToDevice("open_lid");
    res.json({
      ok: true,
      message: "Command sent to device",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

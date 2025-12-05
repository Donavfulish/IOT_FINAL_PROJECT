import { sendCommandToDevice } from "../services/protocol.services.js";
import {
  sendFaultSignal,
  getOledMessageService,
  updateOledMessageService,
  createTempHistoryService,
  getTempInOneHourService,
  sendTemp,
  updateFillLevelService,
  createEventLogService,
  createSystemAlertService,
} from "../services/device.services.js";

export const handleReceivingMqttMessage = (device, data) => {
  const binId = 1;
  if (device === "button") {
    if (data === "device-malfunction") sendFaultSignal();
  }
  if (device === "ultra") {
    console.log("ultra:", data);
    updateFillLevelService(binId, data);
    if (data == 100) {
      createEventLogService(binId, "The smart bin is full");
      createSystemAlertService(
        binId,
        `BIN-${binId}: Fill level is full`,
        "Fill Level: 100% - Critical Threshold Exceeded"
      );
    }
  }
  if (device === "temp") {
    createTempHistoryService(binId, data);
    sendTemp(data);
  }
};

export const openLed = (req, res) => {
  try {
    const result = sendCommandToDevice("open_led");
    res.json({
      ok: true,
      message: "Command sent to device",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const messageToOled = (req, res) => {
  try {
    const device = "oled";
    const message = "This is massage from backend";
    const result = sendCommandToDevice(device, message);
    res.json({
      ok: true,
      message: "Command sent to device",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const getOledMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getOledMessageService(id);
    res.json({
      ok: true,
      message: "get message sucess",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const updateOledMessage = async (req, res) => {
  try {
    const { id, message } = req.body;
    const updateResult = await updateOledMessageService(id, message);
    const espResult = sendCommandToDevice("oled", message);
    res.json({
      ok: true,
      message: "update message sucess",
      updateResult,
      espResult,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};
export const getTempInOneHour = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getTempInOneHourService(id);

    res.json({
      ok: true,
      message: "get temperature sucess",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

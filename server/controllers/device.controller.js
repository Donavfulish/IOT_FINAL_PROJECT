import { sendCommandToDevice } from "../services/protocol.services.js";
import {
  sendFaultSignal,
  getOledMessageService,
  updateOledMessageService,
  updateLedConfigService,
  createTempHistoryService,
  getTempInOneHourService,
  sendTemp,
  updateFillLevelService,
  createEventLogService,
  createSystemAlertService,
  sendFillLevel,
  getEventLogService,
  getSystemAlertService,
  warningHighTemperature,
} from "../services/device.services.js";
import { sendMail } from "../services/email.services.js";

export const handleReceivingMqttMessage = async (device, data) => {
  const binId = 1;
  if (device === "button") {
    if (data === "device-malfunction") await sendFaultSignal(binId);
  }
  if (device === "ultra") {
    console.log("ultra:", data);
    updateFillLevelService(binId, data);
    if (data == 100) {
      createEventLogService(binId, "The smart bin is full");
      createSystemAlertService(
        binId,
        `BIN-${binId}: Fill level is full`,
        "Fill Level: 100% - Critical Threshold Exceeded",
        "warning"
      );
      sendMail("Smart Bin", "Thùng rác đầy rồi", "nmluan23@clc.fitus.edu.vn");
      sendFillLevel(data);
    }
  }
  if (device === "temp") {
    createTempHistoryService(binId, data);
    sendTemp(data);
    if (data > 50) await warningHighTemperature(binId, data);
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
<<<<<<< HEAD


export const updateLedConfig = async (req, res) => {
  try {
    const { id, led_mode, time_on_led, time_off_led } = req.body;

    const updateResult = await updateLedConfigService(id, led_mode, time_on_led, time_off_led);

    const mqttPayload = {
        mode: led_mode,   
        start: time_on_led, 
        end: time_off_led   
    };

    const espResult = sendCommandToDevice("led", mqttPayload);

    res.json({
      ok: true,
      message: "Update LED config success",
      updateResult,
      espResult,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: e.message });
  }
};
=======
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
export const getEventLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getEventLogService(id);

    res.json({
      ok: true,
      message: "get event logs sucess",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const getSystemAlerts = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getSystemAlertService(id);
    res.json({
      ok: true,
      message: "get system alerts sucess",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};
>>>>>>> origin/feature/push-notification-backup

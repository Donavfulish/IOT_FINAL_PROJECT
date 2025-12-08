import protocolServices from "../services/protocol.services.js";
import deviceServices from "../services/device.services.js";
import { sendMail } from "../services/email.services.js";

const handleReceivingMqttMessage = async (binId, device, data) => {
  if (!binId)
    console.error(
      "No binId is transferred to handleReivingMqttMessage function"
    );

  console.log("binId:", binId);
  console.log("device:", device);
  console.log("data:", data);

  if (device === "button") {
    if (data === "device-malfunction")
      await deviceServices.sendFaultSignal(binId);
  }
  if (device === "ultra") {
    console.log("ultra:", data);
    protocolServices.sendToFrontendBySocket({
      id: "ultra",
      fillLevel: data,
    });
    deviceServices.updateFillLevelService(binId, data);
    if (data == 100) {
      deviceServices.createEventLogService(binId, "The smart bin is full");
      deviceServices.createSystemAlertService(
        binId,
        `BIN-${binId}: Fill level is full`,
        "Fill Level: 100% - Critical Threshold Exceeded",
        "warning"
      );
      sendMail("Smart Bin", "Thùng rác đầy rồi", "nmluan23@clc.fitus.edu.vn");
      deviceServices.sendFillLevel(data);
    }
  }
  if (device === "temp") {
    deviceServices.createTempHistoryService(binId, data);
    deviceServices.sendTemp(data);
    if (data > 50) await deviceServices.warningHighTemperature(binId, data);
  }
};

const openLed = (req, res) => {
  try {
    const result = protocolServices.sendCommandToDevice("open_led");
    res.json({
      ok: true,
      message: "Command sent to device",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

const messageToOled = (req, res) => {
  try {
    const device = "oled";
    const message = "This is massage from backend";
    const result = protocolServices.sendCommandToDevice(device, message);
    res.json({
      ok: true,
      message: "Command sent to device",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

const getOledMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deviceServices.getOledMessageService(id);
    res.json({
      ok: true,
      message: "get message sucess",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

const updateOledMessage = async (req, res) => {
  try {
    const { id, message } = req.body;
    const updateResult = await deviceServices.updateOledMessageService(
      id,
      message
    );
    const espResult = protocolServices.sendCommandToDevice("oled", message);
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

const updateLedConfig = async (req, res) => {
  try {
    const { id, led_mode, time_on_led, time_off_led } = req.body;

    const updateResult = await deviceServices.updateLedConfigService(
      id,
      led_mode,
      time_on_led,
      time_off_led
    );

    const mqttPayload = {
      mode: led_mode,
      start: time_on_led,
      end: time_off_led,
    };

    const espResult = protocolServices.sendCommandToDevice("led", mqttPayload);

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
const getTempInOneHour = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deviceServices.getTempInOneHourService(id);

    res.json({
      ok: true,
      message: "get temperature sucess",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};
const getEventLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deviceServices.getEventLogService(id);

    res.json({
      ok: true,
      message: "get event logs sucess",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

const getSystemAlerts = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deviceServices.getSystemAlertService(id);
    res.json({
      ok: true,
      message: "get system alerts sucess",
      result,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export default {
  handleReceivingMqttMessage,
  openLed,
  messageToOled,
  getOledMessage,
  updateOledMessage,
  getTempInOneHour,
  getEventLogs,
  getSystemAlerts,
  updateLedConfig,
};

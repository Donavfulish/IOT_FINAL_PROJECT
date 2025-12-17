import protocolServices from "../services/protocol.services.js";
import deviceServices from "../services/device.services.js";
import { sendMail } from "../services/email.services.js";
import userServices from "../services/user.services.js";

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
    protocolServices.sendToFrontendBySocket({
      id: "ultra",
      fillLevel: data,
    });
    await deviceServices.updateFillLevelService(binId, data);
    if (data == 100) {
      await deviceServices.createEventLogService(
        binId,
        "The bin is full",
        "danger"
      );
      await deviceServices.createSystemAlertService(
        binId,
        `Fill level is full`,
        "Fill Level: 100% - Critical Threshold Exceeded",
        "warning"
      );
      const managers = await userServices.getBinManagers(binId);
      const sendMailPromises = managers.map((user) =>
        sendMail("Smart Bin", `Your bin (ID-${binId}) is full`, user.email)
      );
      await Promise.all(sendMailPromises)
    }
  } 
  if (device === "temp") {
    await deviceServices.createTempHistoryService(binId, data);
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
  console.log(req);
  try {
    const { id, message } = req.body;
    const updateResult = await deviceServices.updateOledMessageService(
      id,
      message
    );
    const espResult = protocolServices.sendCommandToDevice("oled", message);
    console.log(updateResult, espResult);
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
    const { id, led_mode, time_on_led, time_off_led, is_led_on } = req.body;

    const updateResult = await deviceServices.updateLedConfigService(
      id,
      led_mode,
      time_on_led,
      time_off_led,
      is_led_on
    );

    const mqttPayload = {
      mode: led_mode,
      start: time_on_led,
      end: time_off_led,
      isOn: is_led_on,
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

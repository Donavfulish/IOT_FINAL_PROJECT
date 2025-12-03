import { sendCommandToDevice, getOledMessageService, updateOledMessageService } from "../services/device.services.js";

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
        const {id} = req.params
        const result = await getOledMessageService(id);
        res.json({
            ok: true,
            message: 'get message sucess',
            result,
        })
    } catch (e) {
        res.status(500).json({ ok: false, message: e.message });
    }
};

export const updateOledMessage = async (req, res) => {
    try {
        const {id, message} = req.body
        const updateResult = await updateOledMessageService(id, message);
        const espResult = sendCommandToDevice("oled", message);
        res.json({
            ok: true,
            message: 'update message sucess',
            updateResult,
            espResult
        })
    } catch (e) {
        res.status(500).json({ ok: false, message: e.message });
    }
};




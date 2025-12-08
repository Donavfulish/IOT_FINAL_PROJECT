import userServices from "../services/user.services.js";

const login = async (req, res) => {
  try {
    const userData = await userServices.loginUserAndGet(req.body);
    res.status(200).json(userData);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

const register = async (req, res) => {
  try {
    const result = await userServices.registerUserAndGet(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

const getManagedBinId = async (req, res) => {
  try {
    const user_id = req.headers["user-id"] || null;
    if (!user_id) res.status(200).json({ message: "Unable to get user-id" });

    const binId = await userServices.getManagedBinId();
    res.status(200).json(binId);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export default { login, register, getManagedBinId };

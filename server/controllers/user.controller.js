import {
  loginUserAndGet,
  registerUserAndGet,
} from "../services/user.service.js";

export const login = async (req, res) => {
  try {
    const userData = await loginUserAndGet(req.body);
    res.status(200).json(userData);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export const register = async (req, res) => {
  try {
    const result = await registerUserAndGet(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

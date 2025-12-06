import BinServices from "../services/bin.services.js";

export const getBinDetailById = async (req, res) => {
  try {
    const bin_id = parseInt(req.params.id);
    const binData = await BinServices.getBinDetailById(bin_id);
    res.status(200).json(binData);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

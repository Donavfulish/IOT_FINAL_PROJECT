import BinServices from "../services/bin.services.js";

const getAllBins = async (req, res) => {
  try {
    const binsData = await BinServices.getAllBins();
    res.status(200).json(binsData);
  } catch (e) {
    res.status(200).json({ ok: false, message: e.message });
  }
};

const getBinDetailById = async (req, res) => {
  try {
    const bin_id = parseInt(req.params.id);
    const binData = await BinServices.getBinDetailById(bin_id);
    res.status(200).json(binData);
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
};

export default { getAllBins, getBinDetailById };

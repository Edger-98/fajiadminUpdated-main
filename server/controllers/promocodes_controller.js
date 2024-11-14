const Promocode = require("../models/promocodes_model");
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
// ****************
//Get All  promocodes
// ****************

exports.getAllPromocodes = async (req, res) => {
  try {
    const promocodes = await Promocode.find();
    const formattedPromocodes = promocodes.map((promocode) => ({
      ...promocode._doc,
      expiry_date: formatDate(promocode.expiry_date),// Format as mm/dd/yyyy
    }));

    return res.json(formattedPromocodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// *************************
//Get single promocode by id
// *************************

exports.getSinglePromocode = async (req, res) => {
  try {
    const promocode = await Promocode.findById(req.params.id);
    if (!promocode) {
      return res.status(404).json({ message: "Promocode not found" });
    }

    return res.json(promocode);
    res.status(200).send(promocode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// *************************
//Create/ Add new promocodes
// *************************

exports.createPromocodes = async (req, res) => {
  const { code, applicable_events,expiry_date, discount_val } = req.body;
 
  const promocode = new Promocode({
    code,
    applicable_events,
    expiry_date,
    discount_val,
  });
  try {
    const newPromocode = await promocode.save();
    res.status(201).json(newPromocode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// *************************
//update  promocodes
// *************************

exports.updatedPromocode = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPromocode = await Promocode.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPromocode) {
      return res.status(404).send({ message: "Promocode not found" });
    }
    res.status(200).send(updatedPromocode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// *************************
//Delete  promocodes
// *************************

exports.deletePromocode = async (req, res) => {
  try {
    await Promocode.findByIdAndDelete(req.params.id);
    res.json({ message: "Promocode deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

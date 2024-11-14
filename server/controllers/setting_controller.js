const Setting = require("../models/settings_model");
const settingValidationSchema = require("../validators/setting_Validators");

exports.createSettings = async (req, res) => {
  const { error } = settingValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { title, short_desc, phone_num, email, currency } = req.body;
  const newSetting = await new Setting({
    title,
    short_desc,
    phone_num,
    email,
    currency,
  });

  try {
    const savedSetting = await newSetting.save();
    res.status(201).json(savedSetting);
  } catch (err) {
    console.error("Error creating setting:", err);
    res
      .status(500)
      .json({ error: "Error creating setting", details: err.message });
  }
};

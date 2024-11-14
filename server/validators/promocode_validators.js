const validatePromocode = (req, res, next) => {
    const { discount_val } = req.body;
    
    const numericDiscount = parseFloat(discount_val);
    if (isNaN(numericDiscount)) {
      return res.status(400).send({ message: 'Invalid discount value. Please enter a number.' });
    }
    req.body.discount_val = numericDiscount;
    next();
  };
  module.exports = validatePromocode;
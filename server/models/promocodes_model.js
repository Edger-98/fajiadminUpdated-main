const mongoose = require('mongoose');

const promocodesSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
    },
    applicable_events:{
        type:[String],
        required: true,
    },
    expiry_date:{
        type:Date,
        required: true,
    },
    discount_val:{
        type:Number,
        required: true,
        validate: {
            validator: function(value) {
              return value >= 0;
            },
            message: props => `${props.value} is not a valid discount value!`
          }
    }

})

module.exports =  mongoose.model('Promocode', promocodesSchema);
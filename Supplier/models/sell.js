const mongoose = require('mongoose');

const sellSchema = mongoose.Schema({
    sellItems: [{
        product:{
            type: String,
        },
        quantity:{
            type: Number,
        },
    }],
    price:{
        type: Number,
    },
    user:
    {
        type:String,
    },
    dateSold: {
        type: Date,
        default: Date.now,
    },
})

sellSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

sellSchema.set('toJSON', {
    virtuals: true,
});

exports.Sell = mongoose.model('Sell', sellSchema);



/**
sell Example:

{
    "SellItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "price":1000
    "user": "5fd51bc7e39ba856244a3b44"
}

 */
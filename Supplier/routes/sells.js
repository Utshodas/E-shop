const {Sell} = require('../models/sell');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const sellList = await Sell.find().sort({'datesold': -1});

    if(!sellList) {
        res.status(500).json({success: false})
    } 
    res.send(sellList);
})

router.get(`/:id`, async (req, res) =>{
    const sell = await Sell.findById(req.params.id);

    if(!sell) {
        res.status(500).json({success: false})
    } 
    res.send(sell);
})

router.post('/', async (req,res)=>{
    let sell = new Sell({
        sellItems: req.body.sellItems,
        price: req.body.price,
        user: req.body.user,
    })
    sell = await sell.save();

    if(!sell)
    return res.status(400).send('the sell cannot be created!')
    res.send(sell);
})

router.put('/:id',async (req, res)=> {
    const sell = await Sell.findByIdAndUpdate(
        req.params.id,
        {
            sellItems: req.body.sellItems,
            price: req.body.price,
            user: req.body.user,
        },
        { new: true}
    )
    sell = await sell.save();

    if(!sell)
    return res.status(400).send('the sell cannot be update!')
    res.send(sell);
})

router.delete('/:id', (req, res)=>{
    Sell.findByIdAndRemove(req.params.id).then(async sell =>{
        if(sell) {
            await sell.sellItems.map(async sellItem => {
                await sellItem.findByIdAndRemove(sellItem)
            })
            return res.status(200).json({success: true, message: 'the sell is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "sell not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Sell.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$price'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The total sales cannot be generated')
    }
    res.send({totalsales: totalSales.pop().totalsales})
})

router.get(`/get/count`, async (req, res) =>{
    const sellCount = await Sell.countDocuments((count) => count)

    if(!sellCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        sellCount: sellCount
    });
})


module.exports =router;
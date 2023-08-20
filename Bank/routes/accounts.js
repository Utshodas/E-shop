const {Account} = require('../models/account');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const accountList = await Account.find();

    if(!accountList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(accountList);
})  

router.get('/:id', async(req,res)=>{
    const account = await Account.findById(req.params.id);

    if(!account) {
        res.status(500).json({message: 'The Account with the given ID was not found.'})
    } 
    res.status(200).send(account);
})
router.get('/balance/:id', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);

        if (!account) {
            return res.status(404).json({ message: 'The Account with the given ID was not found.' });
        }

        res.status(200).json({ balance: account.balance }); // Send only the balance
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the balance.' });
    }
});

router.post('/', async (req, res) => {
    let account = new Account({
        name: req.body.name,
        email: req.body.email,
        balance: req.body.balance,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });

    try {
        account = await account.save();
        res.send(account);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the account.');
    }
});


router.put('/:id',async (req, res)=> {
  
    const account = await Account.findByIdAndUpdate(
        req.params.id,
        {
        name: req.body.name,
        email: req.body.email,
        balance: req.body.balance,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        },
        { new: true}
    )

    if(!account)
    return res.status(400).send('the Account cannot be created!')

    res.send(Account);
})


router.delete('/:id', (req, res)=>{
    Account.findByIdAndRemove(req.params.id).then(account =>{
        if(account) {
            return res.status(200).json({success: true, message: 'the Account is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "Account not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const accountCount = await Account.countDocuments((count) => count)

    if(!accountCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        accountCount: accountCount
    });
})

module.exports =router;
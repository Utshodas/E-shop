const express = require('express');
const {Transaction} = require('../models/transaction');
const {Account} = require('../models/account');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const transactionList = await Transaction.find().populate('bankAccountId', 'email').sort({'timestamp': -1});

    if(!transactionList) {
        res.status(500).json({success: false})
    } 
    res.send(transactionList);
})

router.get(`/:id`, async (req, res) =>{
    const transaction = await Transaction.findById(req.params.id)
    .populate('bankAccountId', 'email');

    if(!transaction) {
        res.status(500).json({success: false})
    } 
    res.send(transaction);
})

router.post('/', async (req, res) => {

    const { amount, bankAccountId, status } = req.body;

    let transaction = new Transaction({
      amount,
      bankAccountId: bankAccountId,
      status,
    });
    if (status === 'paid') {
        const bankAccount = await Account.findById(bankAccountId);
        if (!bankAccount) {
          return res.status(404).send('Bank account not found');
        }
        if (bankAccount.balance < amount) {
          return res.status(400).send('Insufficient balance in the bank account');
        }
        bankAccount.balance -= amount;
        await bankAccount.save();
  
        const ecommerce = await Account.findById("64e1a07be1941f88180c3bbe");
        if (!ecommerce) {
          return res.status(404).send('Ecommerce not found');
        }
  
        ecommerce.balance += amount;
        await ecommerce.save();
      }
      transaction = await transaction.save();
      if (!transaction) {
        return res.status(400).send('The transaction could not take place');
      }
      res.status(200).json(transaction);
})
  


router.put('/:id',async (req, res)=> {
    const transaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!transaction)
    return res.status(400).send('the transaction cannot be updated!')

    res.send(transaction);
})


router.delete('/:id', (req, res)=>{
    Transaction.findByIdAndRemove(req.params.id).then(transaction =>{
        if(transaction) {
            return res.status(200).json({success: true, message: 'the transaction is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "transaction not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


router.get(`/get/count`, async (req, res) =>{
    const transactionCount = await Transaction.countDocuments((count) => count)

    if(!transactionCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        transactionCount: transactionCount
    });
})


module.exports =router;
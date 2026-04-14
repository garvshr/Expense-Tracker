const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    amount : {  
        type : Number,
        required : true
    },
    category : {
        type : String,
        enum : ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Housing', 'Health', 'Other'],
        default : "Other"
    },
    date : {
        type : Date,
        default : Date.now
    }
}, {timestamps : true});

module.exports = mongoose.model('Expense', expenseSchema);
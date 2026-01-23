import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    groupId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Group", 
        required: true 
    },
       
    items: [{
        itemName: { type: String, required: true },
        itemPrice: { type: Number, required: true },
        
        // The person who actually took the money out of their pocket
        paidBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },

        sharedBy: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }] 
    }],
    totalAmount: { 
        type: Number, 
        required: true 
    }, // This will be the sum of all itemPrice values
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
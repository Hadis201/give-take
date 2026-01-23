//console.log("APP FILE PATH:", import.meta.url);

import express from 'express';
const app = express();
//console.log("1-app.js started");


import cors from "cors"
import cookieParser from 'cookie-parser'
//console.log(2)
app.use(cors())
app.use(express.json({limit:"16KB"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
//app.use(express.static("public"))
app.use(cookieParser())

//Request logging middleware
app.use((req, res, next) => {
    console.log(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

//console.log("3-app.js loaded middleware");

import authRouter from "./router/auth.router.js"

//console.log("4-app.js loaded auth router");

  
import groupRouter from "./router/group.router.js" 
import expenseRouter from "./router/expense.router.js"
import userRouter from "./router/user.router.js"
import { errorHandler } from './utils/errorHandler.js';

app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)
app.use("/api/groups",groupRouter)
app.use("/api/expenses",expenseRouter)  

console.log("app.js loaded all routers");


app.use(errorHandler)





export default app;
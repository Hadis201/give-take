import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST — always first

import connectDb from "./db/index.js";
console.log("SERVER FILE PATH:", import.meta.url);
import app from "./app.js";

connectDb()
.then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(1)
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("DB connection failed:", err);
});

// // utils/asyncHandler.js
// const asyncHandler = (requestHandler) => {
//    return (req, res, next) => {
//       Promise.resolve(requestHandler(req, res, next))
//          .catch((err) => {
//             // Always check if next is a function before calling
//             if (typeof next === 'function') {
//                return next(err);
//             }
//             // Fallback: handle error directly
//             const statusCode = err?.statusCode || err?.code || 500;
//             if (!res.headersSent) {
//                return res.status(statusCode).json({
//                   success: false,
//                   message: err?.message || "Internal server error"
//                });
//             }
//          });
//    };
// };

// export { asyncHandler };

// utils/asyncHandler.js
const asyncHandler = (requestHandler) => {
   return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next))
         .catch(next); // Simply pass error to next middleware
   };
};

export { asyncHandler };
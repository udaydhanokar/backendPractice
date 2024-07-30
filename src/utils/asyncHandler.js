//async handler karenga kya kuch nahi bas yye ek method banayenga or ucko export karenga

const asyncHandler = (requestHandler) =>{
   return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
  
export {asyncHandler}
// const asyncHandler = (fn)=>()=>{}


// const asyncHandler = (func)=>{()=>{}} //curlybresses la hatavla bss


// const asyncHandler = (fn)=> async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
        
//     } catch (error) {
//         res.status(err.code || 500).json(
//             {
//                 success:false,
//                 message:err.message
//             }
//         )
//     }
// }

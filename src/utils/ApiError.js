//node.js apko ek class deta hai errors nam se

class ApiErrors extends Error{//here we extends (take controls of properties of node.js Error class)
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode= statusCode //overright 
        this.data = null
        this.message = message
        this.success=false;
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
            console.log('hi error');
        }

    }
}
export {ApiErrors}
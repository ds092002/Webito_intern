class ApiError extends Error {
    constructor(
        statusCode,
        message= 'Somthing Went Wrong',
        error = [],
        stack = ""
    ){
        super (message)
        this.statusCode = statusCode
        this.Data = null
        this.message = message
        this.success = false;
        this.error = this.error

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
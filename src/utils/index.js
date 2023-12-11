class AppError{
    message;
    status;
    constructor(message , status = 401){
        this.message = message,
        this.status = status
    }
}

module.exports = AppError
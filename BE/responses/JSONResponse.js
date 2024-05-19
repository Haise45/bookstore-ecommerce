class JSONResponse extends Error {
    constructor(status, message, data) {
        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
        this.type = `${status}`.startsWith('4') ? 'error' : 'success';

        Error.captureStackTrace(this, this.constructor);
    }
}

export default JSONResponse;
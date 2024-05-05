const asyncHandler = (requestHandler) => {
    try {
        return (req, res, next) => {
            Promise.resolve(requestHandler(req, res, next)).catch(next);
        };
    } catch (error) {
        console.log("-->E: aysncHandler", error);
    }
};

export default asyncHandler;

const sendTokenResponse = async (statusCode, user, res, message) => {
    const Token = await user.generateAccessToken();

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY * 60 * 60 * 1000
        ),
        httpOnly: true,
        // secure: true
    };

    // res with cookies
    res.status(statusCode).json({
        success: true,
        token: Token,
        message: message,
        user: {
            id: user.id,
            Name: user.Name,
            Email: user.Email,
            Since: user.createdAt,
        },
    });
};

export default sendTokenResponse;

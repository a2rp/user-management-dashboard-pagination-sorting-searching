const COOKIE_NAME = "um_session";
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
});

const setSessionCookie = (res, token) => {
    res.cookie(COOKIE_NAME, token, cookieOptions());
};

const clearSessionCookie = (res) => {
    res.clearCookie(COOKIE_NAME, cookieOptions());
};

module.exports = { COOKIE_NAME, SESSION_MAX_AGE_MS, setSessionCookie, clearSessionCookie };

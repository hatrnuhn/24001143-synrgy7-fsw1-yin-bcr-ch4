const withJSON = (res, code, payload) => {
    res.setHeader(`Content-Type`, `application/json`);
    res.statusCode = code;
    res.end(JSON.stringify(payload));
}
const withError = (res, code, msg) => {
    return withJSON(res, code, {Error: `${code} ${msg}`});
}

module.exports = {
    withJSON,
    withError
}
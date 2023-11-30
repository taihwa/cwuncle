const CryptoJS = require('crypto-js');
const _ = require('underscore')
const CLIENT_KEY = 'c18a28ba-ccd1-4ccc-b31e-53f719a2a002';
const SECRET_KEY = '1e14850c5c65379386455630fe7dfa4db93a1cfb';
const AUTH_TYPE = 'CEA algorithm=HmacSHA256';

exports.getHACM = (method, address, data) => {

  function getPath(url) {
    const pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
    const result = url.match(pathRegex);
    return result && result.length > 1 ? result[1] : '';
  }

  function getQueryString(url) {
    const arrSplit = url.split('?');
    return arrSplit.length > 1 ? url.substring(url.indexOf('?') + 1) : '';
  }

  function getAuthHeader(httpMethod, requestUrl, requestBody) {
    const requestPath = getPath(requestUrl);
    const queryString = getQueryString(requestUrl);
    let timestamp = `${new Date().toISOString().split('.')[0]}Z`;
    timestamp = timestamp.replace(/:/gi, '').replace(/-/gi, '').substring(2);
    let requestData = [timestamp, httpMethod, requestPath, queryString].join('');
    requestData = replaceVariables(requestData);
    const hash = CryptoJS.HmacSHA256(requestData, SECRET_KEY);
    const hmacDigest = CryptoJS.enc.Hex.stringify(hash);
    const authHeader = `${AUTH_TYPE}, access-key=${CLIENT_KEY}, signed-date=${timestamp}, signature=${hmacDigest}`;
    return authHeader;
  }

  function replaceVariables(templateString) {
    const tokens = _.uniq(templateString.match(/{{\w*}}/g));
    _.forEach(tokens, (t) => {
      const variable = t.replace(/[{}]/g, '');
      const value = environment[variable] || globals[variable];
      templateString = templateString.replace(new RegExp(t, 'g'), value);
    });

    return templateString;
  }

    return getAuthHeader(method, address, data);

};


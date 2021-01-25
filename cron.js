require('dotenv').config();

const request = require('request-promise-native');

let domainsArray;
let count;
// Timeout so server (index.js) can start

setTimeout(() => {
  setDomainsArray().then((response) => {
    domainsArray = response;
    Object.values(domainsArray).forEach((domainObject) => {
      // console.log(domainObject);
      setInterval(() => {
        count = count = 1;
        check(domainObject.domain, domainObject.port);
        if ((count / domainsArray.length) > 5) {
          domainsArray = setDomainsArray().then(() => {
            count = 0;
          });
        }
      }, domainObject.checkFrequency * 1000);
    });
  });
}, 50000);

/**
 * setDomainsArray
 * Finds all domains inside the domains mongo collection
 * @return {Promise}
 */
function setDomainsArray() {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: 'http://uptimerobotserver.netlify.app/.netlify/functions/index/api/domains',
    }).then((results) => {
      resolve(JSON.parse(results));
    }).catch((err) => {
      // console.error(err, 'Error while contacting index server');
      reject(err);
    });
  });
}

/**
 * check
 *
 * Sends request to /api/check to check and insert domain and port status into
 * database
 *
 * @param {string} domain
 * @param {int} port
 */
function check(domain, port) {
  request({
    method: 'GET',
    uri: 'http://uptimerobotserver.netlify.app/.netlify/functions/index/api/domains',
    body: {
      domain, port,
    },
    json: true,
  }).then((response) => {
    console.log(response);
  }).catch((err) => {
  });
}

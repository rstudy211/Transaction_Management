const {Cashfree} = require('cashfree-pg');
const {load} = require('@cashfreepayments/cashfree-js')

let cashfree;
var initializeSDK = async function () {          
    cashfree = await load({
        mode: "sandbox"
    });
};
initializeSDK();
Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.TEST; // Use PRODUCTION for live environment

module.exports = Cashfree;

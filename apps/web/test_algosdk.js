const algosdk = require("algosdk");

try {
  const addr = algosdk.getApplicationAddress(NaN);
  console.log("APP_ADDRESS:", addr);
} catch (e) {
  console.log("APP_ADDRESS ERROR:", e.message);
}

try {
  algosdk.decodeAddress(undefined);
} catch (e) {
  console.log("DECODE_UNDEFINED ERROR:", e.message);
}

try {
  algosdk.decodeAddress(null);
} catch (e) {
  console.log("DECODE_NULL ERROR:", e.message);
}

try {
  const suggestedParams = {
    fee: 1000,
    firstRound: 1,
    lastRound: 10,
    genesisID: "a",
    genesisHash: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
  };
  algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: "EU535NM6M7P5V5KXYBHEQ243XOHMGBGZXZ63A4U6CZTGEB4Q4MEL3U67YI",
    to: undefined,
    amount: 100,
    suggestedParams
  });
} catch (e) {
  console.log("PAYMENT_TXN ERROR:", e.message);
}

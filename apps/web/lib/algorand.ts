import algosdk from 'algosdk';

const algodToken = '';
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// You must set this manually from your deployment
const rawAppId = process.env.NEXT_PUBLIC_ESCROW_APP_ID || "0";
export const ESCROW_APP_ID = parseInt(rawAppId); 

export const constructFundingTxGroup = async (
  senderAddress: string,
  taskId: number,
  rewardMicroAlgos: number
) => {
  const suggestedParams = await algodClient.getTransactionParams().do();
  
  if (!ESCROW_APP_ID || ESCROW_APP_ID <= 0) {
    throw new Error("Invalid ESCROW_APP_ID. Please set NEXT_PUBLIC_ESCROW_APP_ID in your .env.local file.");
  }

  if (!senderAddress) {
    throw new Error("Sender address is missing.");
  }

  const appAddress = algosdk.getApplicationAddress(ESCROW_APP_ID);
  if (!appAddress) {
    throw new Error(`Could not calculate application address for App ID: ${ESCROW_APP_ID}`);
  }

  // Transaction 1: Payment to app
  const ptxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: senderAddress,
    receiver: appAddress,
    amount: rewardMicroAlgos,
    suggestedParams
  });

  // Transaction 2: Application call to "create_task"
  const method = new algosdk.ABIMethod({
    name: "create_task",
    args: [
      { type: "uint64", name: "task_id" },
      { type: "address", name: "creator" },
      { type: "uint64", name: "reward" }
    ],
    returns: { type: "void" }
  });

  const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
    sender: senderAddress,
    appIndex: ESCROW_APP_ID,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams,
    appArgs: [
      method.getSelector(),
      algosdk.encodeUint64(taskId),
      algosdk.decodeAddress(senderAddress).publicKey,
      algosdk.encodeUint64(rewardMicroAlgos)
    ],
    boxes: [
      { appIndex: ESCROW_APP_ID, name: algosdk.encodeUint64(taskId) }
    ]
  });

  // Group transactions
  const txns = [ptxn, appCallTxn];
  algosdk.assignGroupID(txns);

  return txns;
};

export const constructClaimTx = async (senderAddress: string, taskId: number) => {
  const suggestedParams = await algodClient.getTransactionParams().do();
  
  const method = new algosdk.ABIMethod({
    name: "assign_worker",
    args: [
      { type: "uint64", name: "task_id" },
      { type: "address", name: "worker" }
    ],
    returns: { type: "void" }
  });

  const tx = algosdk.makeApplicationCallTxnFromObject({
    sender: senderAddress,
    appIndex: ESCROW_APP_ID,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams,
    appArgs: [
      method.getSelector(),
      algosdk.encodeUint64(taskId),
      algosdk.decodeAddress(senderAddress).publicKey
    ],
    boxes: [
      { appIndex: ESCROW_APP_ID, name: algosdk.encodeUint64(taskId) }
    ]
  });

  return [tx];
};

export const constructReleaseTx = async (senderAddress: string, workerAddress: string, taskId: number) => {
  const suggestedParams = await algodClient.getTransactionParams().do();
  
  const method = new algosdk.ABIMethod({
    name: "release_payment",
    args: [
      { type: "uint64", name: "task_id" }
    ],
    returns: { type: "void" }
  });

  const tx = algosdk.makeApplicationCallTxnFromObject({
    sender: senderAddress,
    appIndex: ESCROW_APP_ID,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams,
    appArgs: [
      method.getSelector(),
      algosdk.encodeUint64(taskId)
    ],
    accounts: [workerAddress], // Must include worker address for inner transaction
    boxes: [
      { appIndex: ESCROW_APP_ID, name: algosdk.encodeUint64(taskId) }
    ]
  });

  return [tx];
}

import algosdk from 'algosdk';

const algodToken = '';
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// You must set this manually from your deployment
export const ESCROW_APP_ID = parseInt(process.env.NEXT_PUBLIC_ESCROW_APP_ID || "12345678"); 

export const constructFundingTxGroup = async (
  senderAddress: string,
  taskId: number,
  rewardMicroAlgos: number
) => {
  const suggestedParams = await algodClient.getTransactionParams().do();
  
  // Actually, we don't know the app address locally without resolving. 
  // Let's assume the user has the APP ID available in ENV.
  const appAddress = algosdk.getApplicationAddress(ESCROW_APP_ID);

  // Transaction 1: Payment to app
  const ptxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderAddress,
    to: appAddress,
    amount: rewardMicroAlgos,
    suggestedParams
  });

  // Transaction 2: Application call to "create_task"
  // Signature in beaker for create_task: create_task(uint64,address,uint64)
  // We mock a standard AppCall since resolving ABI dynamically takes more setup.
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
    from: senderAddress,
    appIndex: ESCROW_APP_ID,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams,
    appArgs: [
      method.getSelector(),
      algosdk.encodeUint64(taskId),
      algosdk.decodeAddress(senderAddress).publicKey,
      algosdk.encodeUint64(rewardMicroAlgos)
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
    from: senderAddress,
    appIndex: ESCROW_APP_ID,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams,
    appArgs: [
      method.getSelector(),
      algosdk.encodeUint64(taskId),
      algosdk.decodeAddress(senderAddress).publicKey
    ]
  });

  return [tx];
};

export const constructReleaseTx = async (senderAddress: string, taskId: number) => {
  const suggestedParams = await algodClient.getTransactionParams().do();
  
  const method = new algosdk.ABIMethod({
    name: "release_payment",
    args: [
      { type: "uint64", name: "task_id" }
    ],
    returns: { type: "void" }
  });

  const tx = algosdk.makeApplicationCallTxnFromObject({
    from: senderAddress,
    appIndex: ESCROW_APP_ID,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams,
    appArgs: [
      method.getSelector(),
      algosdk.encodeUint64(taskId)
    ]
  });

  return [tx];
}

//
//
const fs = require("fs");
const customRequest = require("./customRequest");
const customPath = require("./customPath");
const SCORES = require("./scores");

const keystorePwd = "gochain";
const prepDetails = {
  name: "local-node",
  country: "USA",
  city: "Houston",
  email: "info@test.team",
  website: "https://test.team",
  details: "https://test.team/details.json",
  p2pEndpoint: "127.0.0.1:9000",
  nodeAddress: ""
};

function getKeystore(path) {
  try {
    const ks = JSON.parse(fs.readFileSync(path));
    return ks;
  } catch (err) {
    console.log("Error getting keystore file");
    console.log(err);
    throw new Error("Error getting wallet");
  }
}

function saveResult(resultJson) {
  fs.writeFileSync(customPath("./result.json"), JSON.stringify(resultJson));
}

function convertToLoop(value, returnInHex = false, IconConverter) {
  const valueInLoop = value * 10 ** 18;
  if (returnInHex) {
    return IconConverter.toHex(valueInLoop);
  } else {
    return valueInLoop;
  }
}

async function makeReadOnlyQuery(
  method,
  params = null,
  contract,
  service,
  CallBuilder
) {
  try {
    let call;
    if (params === null) {
      call = new CallBuilder()
        .to(contract)
        .method(method)
        .build();
    } else {
      call = new CallBuilder()
        .to(contract)
        .method(method)
        .params(params)
        .build();
    }

    const response = await service.call(call).execute();
    return response;
  } catch (err) {
    console.log(err);
  }
}

async function makeTxRequest(
  method,
  params,
  walletKs,
  to,
  amount = "0x0",
  nid,
  iconService,
  CallTransactionBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction
) {
  //
  try {
    const walletFromKs = IconWallet.loadKeystore(walletKs, keystorePwd);
    const t = {
      method: method,
      params: params,
      from: walletFromKs.getAddress(),
      to: to,
      stepLimit: IconConverter.toBigNumber("8000000"),
      nid: IconConverter.toBigNumber(nid),
      nonce: IconConverter.toBigNumber("1"),
      version: IconConverter.toBigNumber("3"),
      timestamp: new Date().getTime() * 1000,
      value: amount
    };

    // console.log('makeTxRequest params');
    // console.log(t);
    const txObj = new CallTransactionBuilder()
      .from(t.from)
      .to(t.to)
      .stepLimit(t.stepLimit)
      .nid(t.nid)
      .nonce(t.nonce)
      .version(t.version)
      .timestamp(t.timestamp)
      .method(t.method)
      .params(t.params);

    if (amount != "0x0") {
      txObj.value(t.value);
    }

    const txObj2 = txObj.build();
    const signedTx = new SignedTransaction(txObj2, walletFromKs);
    const txHash = await iconService.sendTransaction(signedTx).execute();

    return txHash;
  } catch (err) {
    console.log(err);
  }
}

async function sendIcx(
  to,
  walletKs,
  IcxAmount,
  iconService,
  nid,
  IcxTransactionBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction
) {
  try {
    const IcxInLoop = convertToLoop(Number(IcxAmount));
    const walletFromKs = IconWallet.loadKeystore(walletKs, keystorePwd);
    const txObj = new IcxTransactionBuilder()
      .from(walletFromKs.getAddress())
      .to(to)
      .value(IcxInLoop)
      .stepLimit(IconConverter.toBigNumber("8000000"))
      .nid(nid)
      .nonce(IconConverter.toBigNumber("1"))
      .version(IconConverter.toBigNumber("3"))
      .timestamp(new Date().getTime() * 1000)
      .build();

    const signedTx = new SignedTransaction(txObj, walletFromKs);
    const txHash = await iconService.sendTransaction(signedTx).execute();

    return txHash;
  } catch (err) {
    console.log(err);
  }
}

async function setBonderList(
  walletKs,
  arrayOfWallets,
  score,
  nid,
  iconService,
  CallTransactionBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction
) {
  return await makeTxRequest(
    "setBonderList",
    { bonderList: arrayOfWallets },
    walletKs,
    score,
    "0x0",
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
}

async function registerPRepNodePublicKey(
  walletKs,
  pubKey,
  address,
  score,
  nid,
  iconService,
  CallTransactionBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction
) {
  return await makeTxRequest(
    "registerPRepNodePublicKey",
    { pubKey: pubKey, address: address },
    walletKs,
    score,
    "0x0",
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
}
async function getBonderList(wallet, score) {
  return await makeReadOnlyQuery("getBonderList", { address: wallet }, score);
}

async function setStake(
  amount,
  walletKs,
  score,
  nid,
  iconService,
  CallTransactionBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction
) {
  const amountInHexLoop = convertToLoop(Number(amount), true, IconConverter);
  return await makeTxRequest(
    "setStake",
    { value: amountInHexLoop },
    walletKs,
    score,
    "0x0",
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
}

async function getStake(wallet, score) {
  return await makeReadOnlyQuery("getStake", { address: wallet }, score);
}

async function setBond(
  amount,
  walletKs,
  score,
  nid,
  iconService,
  CallTransactionBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction
) {
  const walletFromKs = IconWallet.loadKeystore(walletKs, keystorePwd);
  const amountInHexLoop = convertToLoop(Number(amount), true, IconConverter);
  return await makeTxRequest(
    "setBond",
    {
      bonds: [
        {
          address: walletFromKs.getAddress(),
          value: amountInHexLoop
        }
      ]
    },
    walletKs,
    score,
    "0x0",
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
}

async function getBond(wallet, score) {
  return await makeReadOnlyQuery("getBond", { address: wallet }, score);
}

async function setDelegation(
  amount,
  walletKs,
  score,
  nid,
  iconService,
  CallTransactionBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction
) {
  const amountInHexLoop = convertToLoop(Number(amount), true, IconConverter);
  const walletLoaded = IconWallet.loadKeystore(walletKs, keystorePwd);
  return await makeTxRequest(
    "setDelegation",
    {
      delegations: [
        {
          address: walletLoaded.getAddress(),
          value: amountInHexLoop
        }
      ]
    },
    walletKs,
    score,
    "0x0",
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
}

async function getDelegation(wallet, score) {
  return await makeReadOnlyQuery("getDelegation", { address: wallet }, score);
}

async function setPrep(from, walletKs, data, score) {
  return await makeTxRequest("setPRep", { ...data }, from, score, walletKs);
}

async function registerPrep(
  walletKs,
  prepData,
  score,
  nid,
  iconService,
  CallTransactionBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction
) {
  return await makeTxRequest(
    "registerPRep",
    prepData,
    walletKs,
    score,
    "0x6c6b935b8bbd400000",
    nid,
    iconService,
    CallTransactionBuilder,
    IconConverter,
    IconWallet,
    SignedTransaction
  );
}

async function registerTextNetworkProposal(
  title,
  text,
  from,
  walletKs,
  score,
  IconConverter
) {
  const value = [
    {
      name: "text",
      value: {
        text: text
      }
    }
  ];

  return await makeTxRequest(
    "registerProposal",
    {
      title: title,
      description: text,
      value: IconConverter.fromUtf8(JSON.stringify(value))
    },
    from,
    score, // governance2
    walletKs,
    "0x56bc75e2d63100000"
  );
}

async function voteProposal(id, vote, from, walletKs, score) {
  return await makeTxRequest(
    "voteProposal",
    {
      id: id,
      vote: vote
    },
    from,
    score, // governance2
    walletKs
  );
}

async function approveNetworkProposal(id, from, walletKs, score) {
  return await voteProposal(id, "0x1", from, walletKs, score);
}

async function rejectNetworkProposal(id, from, walletKs, score) {
  return await voteProposal(id, "0x0", from, walletKs, score);
}

async function getTotalSupply(apiNode) {
  const JSONRPCObject = JSON.stringify({
    ...makeJSONRPCRequestObj("icx_getTotalSupply")
  });

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    apiNode
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request.result;
  }
}
async function getScoreApi(address = SCORES.mainnet.governance, apiNode) {
  //
  const JSONRPCObject = JSON.stringify({
    ...makeJSONRPCRequestObj("icx_getScoreApi"),
    params: {
      address: address
    }
  });

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    apiNode
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request.result;
  }
}
async function getIcxBalance(hostname, https, port, address, decimals = 2) {
  const JSONRPCObject = JSON.stringify({
    ...makeJSONRPCRequestObj("icx_getBalance"),
    params: {
      address: address
    }
  });

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    hostname,
    https,
    port
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return Number(fromHexInLoop(request.result).toFixed(decimals));
  }
}
async function getTxResult(txHash, apiNode) {
  const JSONRPCObject = JSON.stringify({
    ...makeJSONRPCRequestObj("icx_getTransactionResult"),
    params: {
      txHash: txHash
    }
  });

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    apiNode
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request.result;
  }
}
async function getTxByHash(txHash, apiNode) {
  const JSONRPCObject = JSON.stringify({
    ...makeJSONRPCRequestObj("icx_getTransactionByHash"),
    params: {
      txHash: txHash
    }
  });

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    apiNode
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request.result;
  }
}

async function getPreps(hostname, https, port, height = null) {
  const JSONRPCObject = makeICXCallRequestObj(
    "getPReps",
    { startRanking: "0x1" },
    height,
    SCORES.mainnet.governance
  );
  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    hostname,
    https,
    port
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request.result;
  }
}

async function getPrep(apiNode, prepAddress) {
  //
  const JSONRPCObject = makeICXCallRequestObj(
    "getPRep",
    { address: prepAddress },
    null,
    SCORES.mainnet.governance
  );

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    apiNode
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request.result;
  }
}

async function getNetworkProposals(apiNode = apiNode, params = null) {
  const JSONRPCObject = makeICXCallRequestObj(
    "getProposals",
    params,
    null,
    SCORES.mainnet.governance2
  );

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    apiNode
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after this handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request.result;
  }
}

async function getNetworkProposal(id, apiNode = apiNode) {
  const JSONRPCObject = makeICXCallRequestObj(
    "getProposal",
    { id: id },
    null,
    SCORES.mainnet.governance2
  );

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    apiNode
  );
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after this handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request.result;
  }
}
async function getAllNetworkProposals(apiNode) {
  const maxIterations = 100;
  let loop = 0;
  let start = 0;
  let size = 7;
  let params = {
    start: "0x" + start.toString(16),
    size: "0x" + size.toString(16)
  };
  let proposals = [];

  while (loop < maxIterations) {
    // console.log({ start: parseInt(params.start), size: parseInt(params.size) });
    // console.log({ start: params.start, size: params.size });

    const query = await getNetworkProposals(apiNode, params);

    //
    loop++;
    start = start + size;
    params.start = "0x" + start.toString(16);

    if (query.proposals.length < 1) {
      break;
    }
    query.proposals.map(eachProposal => {
      proposals.push(eachProposal);
    });
  }

  return proposals;
}

function makeJSONRPCRequestObj(method) {
  return {
    jsonrpc: "2.0",
    method: method,
    id: Math.ceil(Math.random() * 1000)
  };
}
const hexToDecimal = hex => {
  return parseInt(hex, 16);
};

const decimalToHex = number => {
  return "0x" + number.toString(16);
};

const fromHexInLoop = loopInHex => {
  let loopInBase2 = hexToDecimal(loopInHex);
  return loopInBase2 / 10 ** 18;
};

function makeICXCallRequestObj(
  method,
  params = null,
  height = null,
  to = "cx0000000000000000000000000000000000000000"
) {
  return makeCustomCallRequestObj("icx_call", method, params, height, to);
}

function makeCustomCallRequestObj(
  icxMethod = "icx_call",
  method,
  params = null,
  height = null,
  to = "cx0000000000000000000000000000000000000000"
) {
  const JSONRPCRequestObj = makeJSONRPCRequestObj(icxMethod);
  let data = {
    ...JSONRPCRequestObj,
    params: {
      to: to,
      dataType: "call",
      data: {
        method: method
      }
    }
  };

  if (params != null) {
    data.params.data.params = params;
  }

  if (height != null) {
    if (typeof height !== "number") {
      throw new Error("Height type must be number");
    } else {
      data.params.height = "0x" + height.toString(16);
    }
  }

  return JSON.stringify(data);
}

async function sleep(time = 1000) {
  await new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

module.exports = {
  approveNetworkProposal,
  decimalToHex,
  getAllNetworkProposals,
  getBond,
  getBonderList,
  getDelegation,
  getIcxBalance,
  getKeystore,
  getNetworkProposal,
  getPrep,
  getPreps,
  getScoreApi,
  getStake,
  getTotalSupply,
  getTxByHash,
  getTxResult,
  prepDetails,
  registerPRepNodePublicKey,
  registerPrep,
  registerTextNetworkProposal,
  rejectNetworkProposal,
  saveResult,
  sendIcx,
  setBond,
  setBonderList,
  setDelegation,
  setPrep,
  setStake,
  sleep
};

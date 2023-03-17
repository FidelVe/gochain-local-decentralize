//
//
const fs = require("fs");
const customRequest = require("./customRequest");
const SCORES = require("./scores");

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
    const walletFromKs = IconWallet.loadKeystore(walletKs, 'gochain');
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
    }

    console.log('makeTxRequest params');
    console.log(t);
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
    console.log('txObj2');
    console.log(txObj2);
    const signedTx = new SignedTransaction(txObj2, walletFromKs);
    const txHash = await iconService.sendTransaction(signedTx).execute();

    console.log("tx object");
    console.log(txObj2);
    console.log(walletFromKs.getAddress());
    console.log(signedTx.getProperties());
    console.log(txHash);
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
    const walletFromKs = IconWallet.loadKeystore(walletKs, 'gochain');
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
    "0x",
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

async function setStake(from, pk, amount, score) {
  const amountInHexLoop = convertToLoop(Number(amount), true);
  return await makeTxRequest(
    "setStake",
    { value: amountInHexLoop },
    from,
    score,
    pk
  );
}

async function getStake(wallet, score) {
  return await makeReadOnlyQuery("getStake", { address: wallet }, score);
}

async function setBond(from, walletKs, prepToBond, amount, score) {
  const amountInHexLoop = convertToLoop(Number(amount), true);
  return await makeTxRequest(
    "setBond",
    { bonds: [{ address: prepToBond, value: amountInHexLoop }] },
    from,
    score,
    walletKs
  );
}

async function getBond(wallet, score) {
  return await makeReadOnlyQuery("getBond", { address: wallet }, score);
}

async function setDelegation(from, walletKs, prepToVote, amount, score) {
  const amountInHexLoop = convertToLoop(Number(amount), true);
  return await makeTxRequest(
    "setDelegation",
    { delegations: [{ address: prepToVote, value: amountInHexLoop }] },
    from,
    score,
    walletKs
  );
}

async function getDelegation(wallet, score) {
  return await makeReadOnlyQuery("getDelegation", { address: wallet }, score);
}

async function setPrep(from, walletKs, data, score) {
  return await makeTxRequest("setPRep", { ...data }, from, score, walletKs);
}

async function registerPrep(walletKs, prepData, score, nid, iconService, CallTransactionBuilder, IconConverter, IconWallet, SignedTransaction) {
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
  await new Promise(resolve => { setTimeout(resolve, time) })
}

module.exports = {
  sendIcx,
  setBonderList,
  getBonderList,
  registerPrep,
  setPrep,
  setStake,
  getStake,
  setBond,
  getBond,
  setDelegation,
  getDelegation,
  registerTextNetworkProposal,
  approveNetworkProposal,
  rejectNetworkProposal,
  getKeystore,
  getNetworkProposal,
  getAllNetworkProposals,
  getPrep,
  getPreps,
  getTxByHash,
  getTxResult,
  getIcxBalance,
  getScoreApi,
  getTotalSupply,
  decimalToHex,
  sleep,
  prepDetails
};

// async function localRun() {
  // test getPreps
  // const query = await getPreps();
  // const mapped = query.preps.map(each => {
  //   return each.name;
  // });
  // console.log(JSON.stringify(mapped));
  // // send icx to prep1
  // const query2 = await sendIcx(DATA.wallets.prep1.a, god.a, 100000000, god.pk);
  // test balances of wallets
  // const balance1 = await getIcxBalance(DATA.wallets.prep1.a);
  // console.log(balance1);
  // test bonderList of wallets
  // const bonderlist1 = await getBonderList(DATA.wallets.prep1.a);
  // console.log(bonderlist1);
  // test setBonderList
  // const setbonderlist2 = await setBonderList(useWalletPub, useWalletPk, [
  //   useWalletPub
  // ]);
  // console.log(setbonderlist2);
  // registerPrep
  // const registerPrep4 = await registerPrep(
  //   useWalletPub,
  //   useWalletPk,
  //   prepDetails
  // );
  // console.log(registerPrep4);
  // await sleep();
  // const queryPreps = await getPreps();
  // console.log(queryPreps);
  //
  // const bonderlist1 = await getBonderList(useWalletPub);
  // console.log(bonderlist1);
  // get tx result
  // const query2 = await getTxResult(
  //   "0x91973b31bbd03381c0c1b46fccfbc54f835673f50a677bef468fb59434a20a56"
  // );
  // console.log(query2);
  // const query3 = await getScoreApi(
  //   "cx0000000000000000000000000000000000000000"
  // );
  // console.log(query3);
  // set stakes
  // const stake1 = await setStake(useWalletPub, useWalletPk, 10000);
  // console.log(stake1);
  // const stake2 = await setStake(
  //   DATA.wallets.prep2.a,
  //   DATA.wallets.prep2.pk,
  //   100000000
  // );
  // console.log(stake2);
  // const stake3 = await setStake(
  //   DATA.wallets.prep3.a,
  //   DATA.wallets.prep3.pk,
  //   100000000
  // );
  // console.log(stake3);
  // const stake4 = await setStake(
  //   DATA.wallets.prep4.a,
  //   DATA.wallets.prep4.pk,
  //   100000000
  // );
  // console.log(stake4);
  // get Stakes
  // const stake1 = await getStake(DATA.wallets.prep1.a);
  // console.log(stake1);
  // const stake2 = await getStake(DATA.wallets.prep2.a);
  // console.log(stake2);
  // const stake3 = await getStake(DATA.wallets.prep3.a);
  // console.log(stake3);
  // const stake4 = await getStake(DATA.wallets.prep4.a);
  // console.log(stake4);
  // set bonds
  // const bond1 = await setBond(useWalletPub, useWalletPk, useWalletPub, 1000);
  // console.log(bond1);
  // const bond2 = await setBond(
  //   DATA.wallets.prep2.a,
  //   DATA.wallets.prep2.pk,
  //   DATA.wallets.prep2.a,
  //   50000000
  // );
  // console.log(bond2);
  // const bond3 = await setBond(
  //   DATA.wallets.prep3.a,
  //   DATA.wallets.prep3.pk,
  //   DATA.wallets.prep3.a,
  //   50000000
  // );
  // console.log(bond3);
  // const bond4 = await setBond(
  //   DATA.wallets.prep4.a,
  //   DATA.wallets.prep4.pk,
  //   DATA.wallets.prep4.a,
  //   50000000
  // );
  // console.log(bond4);
  // get total supply
  // const totalSupply = await getTotalSupply();
  // console.log(totalSupply);
  // get bond
  // const getbond1 = await getBond(DATA.wallets.prep1.a);
  // console.log(getbond1);
  // const getbond2 = await getBond(DATA.wallets.prep2.a);
  // console.log(getbond2);
  // const getbond3 = await getBond(DATA.wallets.prep3.a);
  // console.log(getbond3);
  // const getbond4 = await getBond(DATA.wallets.prep4.a);
  // console.log(getbond4);
  // set delegations
  // const delegation1 = await setDelegation(
  //   useWalletPub,
  //   useWalletPk,
  //   useWalletPub,
  //   9000
  // );
  // console.log(delegation1);
  // const delegation2 = await setDelegation(
  //   DATA.wallets.prep2.a,
  //   DATA.wallets.prep2.pk,
  //   DATA.wallets.prep2.a,
  //   1000
  // );
  // console.log(delegation2);
  // const delegation3 = await setDelegation(
  //   DATA.wallets.prep3.a,
  //   DATA.wallets.prep3.pk,
  //   DATA.wallets.prep3.a,
  //   1000
  // );
  // console.log(delegation3);
  // const delegation4 = await setDelegation(
  //   DATA.wallets.prep4.a,
  //   DATA.wallets.prep4.pk,
  //   DATA.wallets.prep4.a,
  //   1000
  // );
  // console.log(delegation4);
  // get delegation
  // const getdelegation1 = await getDelegation(DATA.wallets.prep1.a);
  // console.log(getdelegation1);
  // const getdelegation2 = await getDelegation(DATA.wallets.prep2.a);
  // console.log(getdelegation2);
  // const getdelegation3 = await getDelegation(DATA.wallets.prep3.a);
  // console.log(getdelegation3);
  // const getdelegation4 = await getDelegation(DATA.wallets.prep4.a);
  // console.log(getdelegation4);
  //
  // register network proposal
  // let query = await registerTextNetworkProposal(
  //   "test proposal 5",
  //   "test paragraph for proposal",
  //   DATA.wallets.prep1.a,
  //   DATA.wallets.prep1.pk
  // );
  //
  // let query1 = await registerTextNetworkProposal(
  //   "test proposal 6",
  //   "test paragraph for proposal",
  //   DATA.wallets.prep1.a,
  //   DATA.wallets.prep1.pk
  // );
  //
  // console.log("network proposal result");
  // console.log(query);
  //
  // const query2 = await getTxResult(
  // "0xa46f6bb8674aaeab3729eaba716b0d33792a8fb2f679d891f1c5d5ae62c68561"
  // );
  // console.log(query2);
  //
  // get all network proposals
  // let query2 = await getAllNetworkProposals();
  // console.log("network proposals");
  // console.log(query2[0]);
  // console.log(query2[0].vote);
  //
  //get network proposal by id
  // let query4 = await getNetworkProposal(
  //   "0xa46f6bb8674aaeab3729eaba716b0d33792a8fb2f679d891f1c5d5ae62c68561"
  // );
  // console.log(query4);
  // console.log(query4.vote.agree);
  //
  // approve network proposal
  // let query3 = await approveNetworkProposal(
  //   "0xa46f6bb8674aaeab3729eaba716b0d33792a8fb2f679d891f1c5d5ae62c68561",
  //   DATA.wallets.prep1.a,
  //   DATA.wallets.prep1.pk
  // );
  // console.log(query3);
// }


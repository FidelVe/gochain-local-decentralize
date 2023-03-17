const {
  getNetworkProposal,
  getAllNetworkProposals,
  getPreps,
  getPrep,
  getTxHash,
  getTxResult,
  getIcxBalance,
  getScoreApi,
  getTotalSupply,
  sleep
} = require("./lib");
const {
  sendIcx,
  DATA,
  setBonderList,
  getBonderList,
  registerPrep,
  setStake,
  getStake,
  setBond,
  getBond,
  setDelegation,
  getDelegation,
  registerTextNetworkProposal,
  approveNetworkProposal,
  rejectNetworkProposal
} = require("./lib-sdk");

const SCORES = require("./scores");
// const god = DATA.wallets.w3;

const useWalletPub = DATA.wallets.w1.a;
const useWalletPk = DATA.wallets.w1.pk;

const prepDetails = {
  name: "Espanicon-Lisbon",
  country: "USA",
  city: "Houston",
  email: "info@espanicon.team",
  website: "https://espanicon.team",
  details: "https://espanicon.team/details.json",
  p2pEndpoint: "127.0.0.1:9000",
  nodeAddress: useWalletPub
};

async function localRun() {
  // test with espanicon API node
  // const query = await getNetworkProposals();
  // console.log(query);
  // console.log(query.proposals.length);
  // test with community API node
  // const query2 = await getNetworkProposals(SCORES.apiHostnames.community);
  // console.log(query2);
  // console.log(query2.proposals.length);
  // test with ctz API node
  // const query3 = await getNetworkProposals(SCORES.apiHostnames.ctz, {
  //   status: "0x0",
  //   start: "0x0",
  //   size: "0xa"
  // });
  // console.log(query3);
  // console.log(query3.proposals.length);
  // test getAllNetworkProposals
  // const query4 = await getAllNetworkProposals();
  // console.log(query4);
  // console.log(query4.length);
  // console.log(JSON.stringify(query4));
  //
  // test getPreps
  // const query = await getPreps();
  // const mapped = query.preps.map(each => {
  //   return each.name;
  // });
  // console.log(JSON.stringify(mapped));
  // // send icx to prep1
  // const query2 = await sendIcx(DATA.wallets.prep1.a, god.a, 100000000, god.pk);
  // console.log(query2);
  // // send icx to prep2
  // const query3 = await sendIcx(DATA.wallets.prep2.a, god.a, 100000000, god.pk);
  // console.log(query3);
  // // send icx to prep3
  // const query4 = await sendIcx(DATA.wallets.prep3.a, god.a, 100000000, god.pk);
  // console.log(query4);
  // // send icx to prep4
  // const query5 = await sendIcx(DATA.wallets.prep4.a, god.a, 100000000, god.pk);
  // console.log(query5);
  // test balances of wallets
  // const balance1 = await getIcxBalance(DATA.wallets.prep1.a);
  // console.log(balance1);
  // const balance2 = await getIcxBalance(DATA.wallets.prep2.a);
  // console.log(balance2);
  // const balance3 = await getIcxBalance(DATA.wallets.prep3.a);
  // console.log(balance3);
  // const balance4 = await getIcxBalance(DATA.wallets.prep4.a);
  // console.log(balance4);
  // const balance5 = await getIcxBalance(god.a);
  // console.log(balance5);
  // test bonderList of wallets
  // const bonderlist1 = await getBonderList(DATA.wallets.prep1.a);
  // console.log(bonderlist1);
  // const bonderlist2 = await getBonderList(DATA.wallets.prep2.a);
  // console.log(bonderlist2);
  // const bonderlist3 = await getBonderList(DATA.wallets.prep3.a);
  // console.log(bonderlist3);
  // const bonderlist4 = await getBonderList(DATA.wallets.prep4.a);
  // console.log(bonderlist4);
  // test setBonderList
  // const setbonderlist2 = await setBonderList(useWalletPub, useWalletPk, [
  //   useWalletPub
  // ]);
  // console.log(setbonderlist2);
  // await sleep();
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
}

module.exports = {
  localRun
};

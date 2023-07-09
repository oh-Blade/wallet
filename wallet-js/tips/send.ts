import * as bitcoin from 'bitcoinjs-lib';
import fetch, { Response } from 'node-fetch';
 
const quantitySat = 0.0001 * 1e8;
const feeSat = 0.0001 * 1e8;
 
(async () => {
  try {
    let NETWORK = bitcoin.networks.testnet;
    const keyPair = bitcoin.ECPair.fromWIF(from_pvtkey, NETWORK);
    const p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK });
    let from = p2pkh.address;
    const utxoResponse: Response = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${from}`);
    const json = await utxoResponse.json();
    console.log(json);
    let balance = json.balance;
    let unspentList: Array<any> = [];
    // 过滤掉已经被花费了的交易和未确认的交易，以及自己不在接收列表的交易
    const txrefs = json.txrefs;
    const unconfirmed_txrefs = json.unconfirmed_txrefs;
    if (unconfirmed_txrefs && unconfirmed_txrefs.length > 0) {
      // 要把未确认的余额给去掉
      balance += json.unconfirmed_balance;
      unspentList = unspentList.concat(unconfirmed_txrefs.filter((item: any) => !item.spent_by && item.tx_output_n !== -1));
    }
    if (txrefs.length > 0) {
      unspentList = unspentList.concat(txrefs.filter((item: any) => !item.spent_by && item.tx_output_n !== -1));
    }
 
    // 构建交易对象
    let txb = new bitcoin.TransactionBuilder(NETWORK);
 
    // 批量插入未花费交易
    unspentList.forEach((item: any) => txb.addInput(item.tx_hash, item.tx_output_n));
    // 转出账户
    txb.addOutput(to, quantitySat);
    // 预留手续费
    txb.addOutput(from, balance - quantitySat - feeSat);
    // 批量签名，根据索引即可
    unspentList.forEach((item: any, index: any) => { txb.sign(index, keyPair) });
    // 序列化交易
    let tx = txb.build();
    console.log(tx.getHash().toString('hex'));
 
    // 在一个测试链的节点把交易广布出去
    const result = await fetch('https://api.blockcypher.com/v1/btc/test3/txs/push',{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({tx: tx.toHex()})
    });
 
 
  } catch (error) {
    console.error(error);
  }
})();
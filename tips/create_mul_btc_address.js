import bitcoin from 'bitcoinjs-lib';

// 生成比特币多签钱包
function generateMultisigWallet(numSignatures, publicKeys) {
  const network = bitcoin.networks.testnet;
  
  // 构建公钥脚本
  const pubKeys = publicKeys.map(key => Buffer.from(key, 'hex'));
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2ms({ m: numSignatures, pubkeys: pubKeys, network }),
    network,
  });

  return {
    address: address,
  };
}

// 示例用法
const numSignatures = 2; // 签名数量
const publicKeys = [
  '03a91261ecf32e509c963cc2341fdf24e2236dff9e85189199caacea95fee5ad45',
  '034b41da41acbd2e8497ce7690442f2d2f43cba6784e9e46e7ba7072fe4e0d7f05',
]; // 公钥数组

const wallet = generateMultisigWallet(numSignatures, publicKeys);

console.log('Address:', wallet.address);
//Address: 2NGBQVmxnoFsC15gR52S46PZjrE8mXR418Q  balance : 0.01586134

// expire case forest quarter plug music dirt only wrist cup hint mass
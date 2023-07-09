import bip39 from 'bip39';
import pkg from 'ethereumjs-wallet';
const { hdkey } = pkg;
// import { hdkey } from 'ethereumjs-wallet';
import util from 'ethereumjs-util';


//1 生成助记词 ；1.1 和 1.2 自己按需。

// 1.1 生成助记词 ;这里用生成的.
//如果是导入助记词 ，直接接收一个数组
let mnemonic = bip39.generateMnemonic() 
// let mnemonic_chinese = bip39.generateMnemonic(128,null,bip39.wordlists.chinese_simplified)
// console.log("中文助记词： " + mnemonic_chinese)

console.log("助记词：" + mnemonic)

//2.将助记词转成seed
const getSeed = async () => {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    console.log("seed：" + util.bufferToHex(seed));
    return seed;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//3.提取私钥，公钥，账户
const obtainAccount = async () => {
  try {
    const seed = await getSeed();
    // 3. 通过hdkey将seed生成HD Wallet
    const hdWallet = hdkey.fromMasterSeed(seed);

    for (let i = 0; i < 5; i++) {
      // 4. 生成钱包中在m/44'/60'/0'/0/i路径的keypair ethereum
      const key = hdWallet.derivePath(`m/44'/60'/0'/0/${i}`);
      // 5. 从keypair中获取私钥
      console.log("私钥：" + util.bufferToHex(key._hdkey._privateKey));
      // 6. 从keypair中获取公钥
      console.log("公钥：" + util.bufferToHex(key._hdkey._publicKey));
      // 7. 使用keypair中的公钥生成地址
      const address = await util.pubToAddress(key._hdkey._publicKey, true);
      // 编码地址
      console.log(`account ${i + 1} 0x${address.toString('hex')}`);

      console.log("- - - - - - - - - - - - - - - - - - - - - -");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

obtainAccount();

/**
 * 
 * 
 */
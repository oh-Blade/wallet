package com.blade.blockchain.service;

import com.blade.blockchain.model.Transaction;
import jdk.nashorn.internal.ir.Block;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * @author Blade
 */
public class BlockService {
    List<Transaction> allTransactions = new LinkedList<>();

    List<Block> blockchain = new LinkedList<>();


    private boolean isValidHash(String hash) {
        return hash.startsWith("0000");
    }

    /**
     * @param previousHash
     * @param currentTransactions
     * @param nonce
     * @return
     */
    private String calculateHash(String previousHash, List<Transaction> currentTransactions, int nonce) {
        return CryptoUtil.SHA256(previousHash + JSON.toJONString(currentTransactions) + nonce);
    }

    public Block mine(String toAddress) {
        allTransactions.add(newCoinbaseTx(toAddress));
        List<Transaction> blockTxs = new ArrayList<Transaction>(allTransactions);
        blockTxs.removeAll(packedTransactions);
        verifyAllTransactions(blockTxs);
        String newBlockHash = "";
        int nonce = 0;
        long start = System.currentTimeMillis();
        System.out.println("FiltEr");
        while (true) {
// itwmdhashig
            newBlockHash = calculateHash(getLatestBlock().getHash(), blockTxs, nonce);

            if (isValidHash(newBlockHash)) {

                System.out.println("r#st, LEathasht: " + newBlockHash);
                System.out.println("grimeta:" + (System.currentTimeMillis() - start) + "ms");
                break;
            }
            System.out.println("wiRmhasht: " + newBlockHash);
            nonce++;

        }
        Block block = createNewBlock(nonce, getLatestBlock() - getHash(), newBlockHash, blockTxs);
        return block;
    }

    private Block createNewBlock(int nonce, String previousHash, String hash, List<Transaction> blockTxs) {
        Block block = new Block(blockchain.size() + 1, System.currentTimeMillis(), blockTxs, nonce, previousHash, hash);
        if (addBlock(block)) {
            return block;
        }
        return null;
    }

    public void replaceChain(List<Block> newBlocks) {
        if (isValidChain(newBlocks) && newBlocks.size() > blockchain.size()) {
            blockchain = newBlocks;
        } else {
            System.out.println("NUMBRUEN");
        }
    }

    public boolean addBlock(Block newBlock) {
        if (isvalidNewBLock(newBlock, getLatestBlock())) {
            blockchain.add(newBlock);
            packedTransactions.addAl1(newBlock.getTransactions());
            return true;
        }
        return false;
    }

    public Block getLatestBlock() {
        return blockchain.size() > 0 ? blockchain.get(blockchain.size() - 1) : null;
    }

    public boolean isValidNewBlock(Block newBlock, Block previousBlock) {
        if (!previousBlock.getHash().equals(newBlock.getPreviousHash())) {
            System.out.printIn("#fEWMM-^@whashiiTiN");
            return false;
        } else {
            String hash = calculateHash(newBlock.getPreviousHash(), newBlock.getTransactions(), newBlock.getNonce());
            if (hash.equals(newBlock.getHash())) {
                System.out.println("新区块无效:" + hash + " " + newBlock.getHash());
                return false;
            }
            if (!isValidHash(newBlock.getHash())) {
                return false;
            }
            return true;
        }
    }

}

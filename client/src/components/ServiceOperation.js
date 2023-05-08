import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRecoilState } from "recoil";
import myNft from '../utils/Pay3.json'
import { currentAccountCommon, displayCommon, tokenIdCommon, ethValueCommon, balanceCommon, subscribeStatusCommon } from './UserStates'
import './User.css';

const CONTRACT_ADDRESS = require("../utils/contractAddress.json").contractAddress;

const App = () => {
  const [currentAccount, setCurrentAccount] = useRecoilState(currentAccountCommon)
  const [display, setDisplay] = useRecoilState(displayCommon)
  const [tokenId, setTokenId] = useRecoilState(tokenIdCommon)
  const [ethValue, setEthValue] = useRecoilState(ethValueCommon)
  const [balance, setBalance] = useRecoilState(balanceCommon)
  const [subscribeStatus, setSubscribeStatus] = useRecoilState(subscribeStatusCommon)

  // check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      console.log('window.ethereum.networkVersion', await ethereum.request({ method: 'net_version' }));
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  // get Balance for display continually
  async function getBalance() {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(currentAccount);
      if (balance) {
        setBalance(ethers.utils.formatEther(balance));
        console.log("ETH balance", ethers.utils.formatEther(balance));
      }
      console.log("ETH balance", ethers.utils.formatEther(balance));
    } else {
      console.log("Ethereum object doesn't exist");
    }
  }

  // mint NFT as virtual wallet
  async function moneyCollection() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)


        setDisplay("start collecting fee")
        await connectedContract.moneyCollection()
        setDisplay("fee collection finished")
        getBalance()
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("error");
    }
  }

  const withdrawServicerFee = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)
        await connectedContract.withdrawServicerFee()
        setDisplay("withdrawServicerFee")
        getBalance()
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("error");
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected()
    getBalance()
  })



  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  // connected wallet UI
  const renderWalletControlUI = () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginTop: '20px' }}>
        <span style={{ color: "white", fontSize: "20px", marginTop: "50px" }}> 1, Collect Fee from Subscribers</span>
        <p />
        <button onClick={moneyCollection} className="cta-button">Collect Fee</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <span style={{ color: "white", fontSize: "20px" }}> 2, Withdraw to own Wallet </span>
        <p />
        <button onClick={withdrawServicerFee} className="cta-button">
          Withdraw
        </button>
      </div>
    </div>
  )

  return (
    <div className="Operation">
      <div>
        {currentAccount === "" ? renderNotConnectedContainer() : renderWalletControlUI()}
      </div>
      <div className="footer-container">
      </div>
    </div>
  );
}

export default App;

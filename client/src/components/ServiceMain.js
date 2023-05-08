import { useState, useEffect } from 'react'
import { ethers, BigNumber } from 'ethers'
import './User.css';
import { useRecoilState } from "recoil";
import myNft from '../utils/Pay3.json';
import {
  currentAccountCommon,
  displayCommon,
  ethValueCommon,
  balanceCommon,
  walletAddressCommon,
} from './ServiceStatus'

const CONTRACT_ADDRESS = require("../utils/contractAddress.json").contractAddress;


const App = () => {
  const [currentAccount, setCurrentAccount] = useRecoilState(currentAccountCommon)
  const [ethValue, setEthValue] = useRecoilState(ethValueCommon)
  const [walletAddress, setWalletAddress] = useRecoilState(walletAddressCommon)
  const [balance, setBalance] = useRecoilState(balanceCommon)
  const [display, setDisplay] = useRecoilState(displayCommon)
  const [numOfSubscribers, setNumOfSubscribers] = useState("")

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
    setWalletAddress(accounts[0]);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
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

  async function getSubscribers() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)


        setDisplay("getting subscribers")
        let subscribers = await connectedContract.subscribers()
        console.log("subscribers: ", subscribers.toString())
        setNumOfSubscribers(subscribers.toString())
        getBalance()
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setDisplay("error");
    }
  }

  async function currentVirtualWalletBallance() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)


        setDisplay("getting subscribers")
        let servicer_wallet = await connectedContract.servicerWallet()
        let srw = BigNumber.from(servicer_wallet._hex)
        console.log("servicer wallet: ", srw)

        setEthValue(ethers.utils.formatEther(srw))
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
    getSubscribers()
    currentVirtualWalletBallance()
  })

  return (
    <div className="Main">
      <p className="header gradient-text">Pay3 Servicer Console
      </p>
      <p className="explain-text">
        Pay3 is a lightweight subscription payment solution
      </p>
      <div className="list-container">
        <ul>
          <li className="list-item">Number of Subscribers: {numOfSubscribers}</li>
          <li className="list-item">Current Virtual Wallet Ballance: {ethValue}</li>
        </ul>
      </div>
      <div className="list-container">
        <ul>
          <li className="list-item">Connected Wallet: {walletAddress}</li>
          <li className="list-item">Balance: {balance}</li>
        </ul>
      </div>
      <div className="footer-container">
      </div>
    </div>
  );
}

export default App;

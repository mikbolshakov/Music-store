import React from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

import ConnectWallet from './components/ConnectWallet';
import WaitingForTransactionMessage from './components/WaitingForTransactionMessage';
import TransactionErrorMessage from './components/TransactionErrorMessage';

import type { MusicStore } from './typechain-types';
import { MusicStore__factory } from './typechain-types/factories';

import MusicStoreArtifact from './contract/MusicStore.json';

const HARDHAT_NETWORK_ID = '1337';

declare let window: any;

class App extends React.Component<any, any> {
  initialState: object;
  _provider!: Web3Provider;
  _musicStore!: MusicStore;

  constructor(props: any) {
    super(props);

    this.initialState = {
      selectedAccount: null,
      txBeingSent: null,
      networkError: null,
      transactionError: null,
      balance: null
    };

    this.state = this.initialState;
  }

  _connectWallet = async() => {
    if(window.ethereum === undefined) {
      this.setState({
        networkError: 'Please install Metamask!'
      });

      return;
    }

    const [selectedAccount] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if(!this._checkNetwork()) { return }

    this._initialize(selectedAccount);

    window.ethereum.on('accountChanged', ([newAddress]: [newAddress: string]) => {
      if(newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    window.ethereum.on('chainChanged', ([_networkId]: any) => {
      this._resetState();
    });
  }
  
  async _initialize(selectedAccount: string) {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    
    this._musicStore = MusicStore__factory.connect(
      MusicStoreArtifact.contracts.MusicStore.address,
      this._provider.getSigner(0)
    )

    this.setState({
      selectedAccount: selectedAccount,
      balance: await this.updateBalance(selectedAccount),
    })
  }

  async updateBalance(selectedAccount?: string | undefined) {
    return (await this._provider.getBalance(
      selectedAccount === undefined ? this.state.selectedAccount : selectedAccount
    )).toString(); 
  }

  _resetState() {
    this.setState(this.initialState);
  }

  _checkNetwork() {
    if(window.ethereum.networkVersion === HARDHAT_NETWORK_ID) { return true }

    this.setState({
      networkError: 'Please connect to Hardhat network (localhost:8545)'
    });
    return false;
  }

  _dismissNetworkError = () => {
    this.setState({
      networkError: null,
    });
  }

  _dismissTransactionError = () => {
    this.setState({
      transactionError: null,
    });
  }

  _getRpcErrorMessage(error: any) {
    if(error.data) {
      return error.data.message;
    }

    return error.message;
  }
  

  render() {
    if(!this.state.selectedAccount) {
      return <ConnectWallet
        connectWallet={this._connectWallet}
        networkError={this.state.networkError}
        dismiss={this._dismissNetworkError}
      />
    }

    return(
      <>
      {this.state.txBeingSent && (
        <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
      )}
      {this.state.transactionError && (
        <TransactionErrorMessage
          message={this._getRpcErrorMessage(this.state.transactionError)}
          dismiss={this._dismissTransactionError}
        />
      )}

      {this.state.balance &&
        <p>
          Your balance: {
          ethers.utils.formatEther(this.state.balance)
          } ETH
          </p>
          }
      </>
    )
  }
}

export default App;
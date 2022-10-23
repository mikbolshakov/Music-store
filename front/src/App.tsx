import React from 'react';
import { ethers } from 'ethers';

import ConnectWallet from './components/ConnectWallet';
import WaitingForTransactionMessage from './components/WaitingForTransactionMessage';
import TransactionErrorMessage from './components/TransactionErrorMessage';

import type { MusicStore } from './typechain';
import { MusicStore_factory } from './typechain/factories';

import MusicStoreArtifact from './contracts/MusicStore.json';

const HARDHAT_NETWORK_ID = '1337';

declare let window: any;

class App extends React.component<any, any> {
  initialState: object;

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
    }
  }
}

export default App;
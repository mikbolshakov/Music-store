import React from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

import ConnectWallet from "./components/ConnectWallet";
import WaitingForTransactionMessage from "./components/WaitingForTransactionMessage";
import TransactionErrorMessage from "./components/TransactionErrorMessage";

import type { MusicStore } from "./typechain-types";
import { MusicStore__factory } from "./typechain-types/factories";

import MusicStoreArtifact from "./contract/MusicStore.json";

const HARDHAT_NETWORK_ID = "1337";

declare let window: any;

type AlbumProps = {
  index: string;
  uid: string;
  title: string;
  price: ethers.BigNumber;
  quantity: ethers.BigNumber;
};

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
      balance: null,
      isOwner: null,
      albumUid: null,
      albumTitle: null,
      albumPrice: null,
      albumQuantity: null,
    };

    this.state = this.initialState;
  }

  _connectWallet = async () => {
    if (window.ethereum === undefined) {
      this.setState({
        networkError: "Please install Metamask!",
      });

      return;
    }

    const [selectedAccount] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAccount);

    window.ethereum.on(
      "accountChanged",
      ([newAddress]: [newAddress: string]) => {
        if (newAddress === undefined) {
          return this._resetState();
        }

        this._initialize(newAddress);
      }
    );

    window.ethereum.on("chainChanged", ([_networkId]: any) => {
      this._resetState();
    });
  };

  async _initialize(selectedAccount: string) {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._musicStore = MusicStore__factory.connect(
      MusicStoreArtifact.contracts.MusicStore.address,
      this._provider.getSigner(0)
    );

    const owner = await this._musicStore.owner();

    this.setState({
      selectedAccount: selectedAccount,
      balance: await this.updateBalance(selectedAccount),
      isOwner: owner.toUpperCase() === selectedAccount.toUpperCase(),
      albums: await this.loadAlbums(),
    });
  }

  async updateBalance(selectedAccount?: string | undefined) {
    return (
      await this._provider.getBalance(
        selectedAccount === undefined
          ? this.state.selectedAccount
          : selectedAccount
      )
    ).toString();
  }

  _resetState() {
    this.setState(this.initialState);
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({
      networkError: "Please connect to Hardhat network (localhost:8545)",
    });
    return false;
  }

  _dismissNetworkError = () => {
    this.setState({
      networkError: null,
    });
  };

  _dismissTransactionError = () => {
    this.setState({
      transactionError: null,
    });
  };

  _getRpcErrorMessage(error: any) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  async loadAlbums() {
    const albums = await this._musicStore.allAlbums();

    return albums.map((album): AlbumProps => {
      return {
        index: album[0].toString(),
        uid: album[1],
        title: album[2],
        price: album[3],
        quantity: album[4],
      };
    });
  }

  handleBuyAlbum = async (
    album: AlbumProps,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    try {
      const tx = await this._musicStore.buy(album.index, {
        value: album.price,
      });

      this.setState({
        txBeingSent: tx.hash,
      });

      await tx.wait();
    } catch (error) {
      console.log(error);

      this.setState({
        TransactionError: error,
      });
    } finally {
      this.setState({
        txBeingSent: null,
        balance: await this.updateBalance(),
        albums: await this.loadAlbums(),
      });
    }
  };
  handleAddAlbum = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const tx = await this._musicStore.addAlbum(
        this.state.albumUid,
        this.state.albumTitle,
        this.state.albumPrice,
        this.state.albumQuantity
      );

      this.setState({
        txBeingSent: tx.hash,
      });

      await tx.wait();
    } catch (error) {
      console.log(error);

      this.setState({
        TransactionError: error,
      });
    } finally {
      this.setState({
        txBeingSent: null,
        balance: await this.updateBalance(),
        albums: await this.loadAlbums(),
      });
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  render() {
    if (!this.state.selectedAccount) {
      return (
        <ConnectWallet
          connectWallet={this._connectWallet}
          networkError={this.state.networkError}
          dismiss={this._dismissNetworkError}
        />
      );
    }

    const listAlbums = this.state.albums.map((album: AlbumProps) => (
      <li key={album.uid}>
        <>
          {album.title} (#{album.index})<br />
          Price: {album.price.toString()}
          <br />
          Quantity: {album.quantity.toString()}
          <br />
          {album.quantity > ethers.BigNumber.from(0) && (
            <button onClick={(e) => this.handleBuyAlbum(album, e)}>
              Buy 1 copy
            </button>
          )}
        </>
      </li>
    ));

    return (
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

        {this.state.balance && (
          <p>
            Your balance: {ethers.utils.formatEther(this.state.balance)} ETH
          </p>
        )}

        <h3>Albums:</h3>
        <ul>{listAlbums}</ul>

        {this.state.isOwner && (
          <form onSubmit={this.handleAddAlbum}>
            <h2>Add album</h2>

            <label>
              UID:
              <input
                type="text"
                name="albumUid"
                onChange={this.handleInputChange}
              />
            </label>

            <label>
              Title:
              <input
                type="text"
                name="albumTitle"
                onChange={this.handleInputChange}
              />
            </label>

            <label>
              Price:
              <input
                type="text"
                name="albumPrice"
                onChange={this.handleInputChange}
              />
            </label>

            <label>
              Quantity:
              <input
                type="text"
                name="albumQuantity"
                onChange={this.handleInputChange}
              />
            </label>

            <input type="submit" value="Add album!" />
          </form>
        )}
      </>
    );
  }
}

export default App;

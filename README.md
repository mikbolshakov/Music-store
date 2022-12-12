# MusicStore - online store with music albums

With this application you can upload an album for sale or buy any album you like that has been uploaded before

## Install
```bash
git clone https://github.com/mikbolshakov/Music-store-project.git music-store
cd music-store/frontend
npm install
cd ../ethereum
npm install
```

## Run
First, run the local blockchain:
```bash
cd ethereum
npx hardhat node
npx hardhat run deploy/deploy_music_store.ts --network localhost
```

Then, run the development server and open [localhost:3000](http://localhost:3000) with your browser to see the result:

```bash
cd frontend
npm start
```

After that, connect your metamask to the local blockchain for work with the DApp in the browser:
```bash
open metamask in browser
import account (type "private key")
enter any private key from the local blockchain
change network to Localhost 8545
```


### Development
Want to contribute? Great!

To fix a bug or enhance an existing module, follow these steps:

- Fork the repo
- Create a new branch (`git checkout -b improve-feature`)
- Make the appropriate changes in the files
- Add changes to reflect the changes made
- Commit your changes (`git commit -am 'Improve feature'`)
- Push to the branch (`git push origin improve-feature`)
- Create a Pull Request 

### Bug / Feature Request

If you find a bug (the website couldn't handle the query and / or gave undesired results), kindly open an issue [here](https://github.com/mikbolshakov/Music-store-project/issues/new) by including your search query and the expected result.

If you'd like to request a new function, feel free to do so by opening an issue [here](https://github.com/mikbolshakov/Music-store-project/issues/new). Please include sample queries and their corresponding results.


## Built with 

- [Typescript](https://www.typescriptlang.org/) - strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [Solidity](https://docs.soliditylang.org/en/v0.8.17/) - object-oriented, high-level language for implementing smart contracts. Smart contracts are programs which govern the behaviour of accounts within the Ethereum state.
- [Hardhat](https://hardhat.org/) - development environment for Ethereum software. It consists of different components for editing, compiling, debugging and deploying your smart contracts and dApps, all of which work together to create a complete development environment.
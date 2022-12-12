# MusicStore - online store with music albums

With this application you can upload an album for sale or buy any album you like that has been uploaded before

Try running some of the following tasks:

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

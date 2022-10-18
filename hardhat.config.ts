import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import '@typechain/hardhat';
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  namedAccounts: {
    deplyer: {
      default: 0
    },
    user: 1
  }
};

export default config;

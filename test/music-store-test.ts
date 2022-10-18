import { expect } from "./chai-setup";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import type { MusicStore } from "../typechain-types";

describe("MusicStore", function() {
    let deployer: string;
    let user: string;
    let musicStore: MusicStore;
    beforeEach(async function() {
        await deployments.fixture(["MusicStore"]);

        ({deployer, user} = await getNamedAccounts());
        musicStore = await ethers.getContract<MusicStore>("MusicStore");
    });

    it("Sets owner", async function () {
        console.log(await musicStore.owner());
        expect(await musicStore.owner()).to.eq(deployer);
    });
});
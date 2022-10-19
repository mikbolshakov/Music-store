import { expect } from "./chai-setup";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import type { MusicStore } from "../typechain-types";

describe("MusicStore", function () {
  let deployer: string;
  let user: string;
  let musicStore: MusicStore;
  beforeEach(async function () {
    await deployments.fixture(["MusicStore"]);

    ({ deployer, user } = await getNamedAccounts());
    musicStore = await ethers.getContract<MusicStore>("MusicStore");
  });

  it("Sets owner", async function () {
    console.log(await musicStore.owner());
    expect(await musicStore.owner()).to.eq(deployer);
  });

  describe("addAlbum()", function () {
    it("Allows owner to add album", async function () {
      const tx = await musicStore.addAlbum("test.123", "Demo Album", 100, 5);
      await tx.wait();

      const newAlbum = await musicStore.albums(0);

      expect(newAlbum.uid).to.eq("test.123");
      expect(newAlbum.title).to.eq("Demo Album");
      expect(newAlbum.price).to.eq(100);
      expect(newAlbum.quantity).to.eq(5);
      expect(newAlbum.index).to.eq(0);

      expect(musicStore.currentIndex).to.eq(1);
    });
  });
});

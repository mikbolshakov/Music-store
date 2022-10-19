import { expect } from "./chai-setup";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import type { MusicStore } from "../typechain-types";

describe("MusicStore", function () {
  let deployer: string;
  let user: string;
  let musicStore: MusicStore;
  let musicStoreAsUser: MusicStore;

  async function addAlbum() {
    const tx = await musicStore.addAlbum("test.123", "Demo Album", 100, 5);
    await tx.wait();
  }

  beforeEach(async function () {
    await deployments.fixture(["MusicStore"]);

    ({ deployer, user } = await getNamedAccounts());
    musicStore = await ethers.getContract<MusicStore>("MusicStore");

    musicStoreAsUser = await ethers.getContract<MusicStore>("MusicStore", user);
  });

  it("Sets owner", async function () {
    // console.log(await musicStore.owner());
    expect(await musicStore.owner()).to.eq(deployer);
  });



  describe("addAlbum()", function () {
    it("Allows owner to add album", async function () {
      await addAlbum();

      const newAlbum = await musicStore.albums(0);

      expect(newAlbum.uid).to.eq("test.123");
      expect(newAlbum.title).to.eq("Demo Album");
      expect(newAlbum.price).to.eq(100);
      expect(newAlbum.quantity).to.eq(5);
      expect(newAlbum.index).to.eq(0);

      expect(await musicStore.currentIndex()).to.eq(1);
    });

    it("Doesn't allow other users to add albums", async function () {
      await expect(musicStoreAsUser.addAlbum("test.123", "Demo Album", 100, 5))
        .to.be.revertedWith("Not an owner!");
    });
  });

  describe("buy()", function () {
    it("Allows buy an album", async function () {
      await addAlbum();

      const tx = await musicStoreAsUser.buy(0, {value: 100});
      await tx.wait();

      const album = await musicStoreAsUser.albums(0);
      expect(album.quantity).to.eq(4);

      const order = await musicStoreAsUser.orders(0);
      // console.log(order);
      expect(order.albumUid).to.eq(album.uid);
      expect(order.customer).to.eq(user);
      expect(order.status).to.eq(0);

      const ts = (await ethers.provider.getBlock(<number>tx.blockNumber)).timestamp;
      expect(order.orderAt).to.eq(ts);
    });
  });
});

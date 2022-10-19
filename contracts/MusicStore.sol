// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MusicStore {
    struct Album {
        uint index;
        string uid;
        string title;
        uint price;
        uint quantity;
    }

    struct Order {
        string albumUid;
        address customer;
        uint orderAt;
        OrderStatus status;
    }

    enum OrderStatus { Paid, Delivered }

    Album[] public albums;
    Order[] public orders;

    address public owner;
    uint public currentIndex;

    event AlbumBought(string indexed uid, address indexed customer, uint indexed timestamp);
    event OrderDelivered(string indexed albumUid, address indexed customer);

    modifier onlyOwner() {
        require(owner == msg.sender, "Not an owner!");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addAlbum(
        string calldata uid, 
        string calldata title, 
        uint price, 
        uint quantity
        ) external onlyOwner {
            albums.push(Album({
                index: currentIndex,
                uid: uid,
                title: title,
                price: price,
                quantity: quantity
            }));

            currentIndex++;
    }

    function buy(uint _index) external payable {
        Album storage albumToBuy = albums[_index];

        require(msg.value == albumToBuy.price, "invalid price");
        require(albumToBuy.quantity > 0, "out of stock");

        albumToBuy.quantity--;

        orders.push(Order({
        albumUid: albumToBuy.uid,
        customer: msg.sender,
        orderAt: block.timestamp,
        status: OrderStatus.Paid
        }));

        emit AlbumBought(albumToBuy.uid, msg.sender, block.timestamp);
    }

    function delivered(uint _index) external onlyOwner {
        Order storage currentOrder = orders[_index];

        require(currentOrder.status != OrderStatus.Delivered, "invalid status");

        currentOrder.status = OrderStatus.Delivered;

        emit OrderDelivered(currentOrder.albumUid, currentOrder.customer);
    }

    receive() external payable {
        revert("Please use the buy function to purchase albums!");
    }

    function allAlbums() external view returns(Album[] memory) {
        Album[] memory albumsList = new Album[](albums.length);

        for(uint i = 0; i < albums.length; i++) {
            albumsList[i] = albums[i];
        }

        return albumsList;
    }
}
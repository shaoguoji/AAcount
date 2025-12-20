// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IAAcountPool.sol";

contract AAcountPool is IAAcountPool {
    string public name;
    string public description;
    address public creator;
    
    mapping(address => bool) public organizers;
    mapping(address => bool) public participants;
    
    Transaction[] public transactions;

    modifier onlyOrganizer() {
        require(organizers[msg.sender] || msg.sender == creator, "Not organizer");
        _;
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "Not creator");
        _;
    }

    function initialize(address _creator, string memory _name, string memory _description) external {
        require(creator == address(0), "Already initialized");
        creator = _creator;
        name = _name;
        description = _description;
        organizers[_creator] = true;
    }

    function deposit(string memory reason) external payable { // Simplified for MVP: Direct ETH deposit
        require(msg.value > 0, "Amount must be > 0");
        
        if (!participants[msg.sender]) {
            participants[msg.sender] = true;
            emit Joined(msg.sender);
        }

        transactions.push(Transaction({
            id: transactions.length,
            initiator: msg.sender,
            amount: msg.value,
            description: reason,
            timestamp: block.timestamp,
            isInflow: true
        }));

        emit Inflow(msg.sender, msg.value, reason);
    }

    function withdraw(address to, uint256 amount, string memory reason) external onlyOrganizer {
        require(address(this).balance >= amount, "Insufficient balance");
        
        (bool sent, ) = payable(to).call{value: amount}("");
        require(sent, "Failed to send Ether");

        transactions.push(Transaction({
            id: transactions.length,
            initiator: msg.sender, // The organizer who authorized it
            amount: amount,
            description: reason,
            timestamp: block.timestamp,
            isInflow: false
        }));

        emit Outflow(to, amount, reason);
    }

    function addOrganizer(address organizer) external onlyCreator {
        organizers[organizer] = true;
        emit OrganizerAdded(organizer);
    }

    function isOrganizer(address account) external view returns (bool) {
        return organizers[account];
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Fallback
    receive() external payable {
        // Allow direct transfers, treat as generic donation
        transactions.push(Transaction({
            id: transactions.length,
            initiator: msg.sender,
            amount: msg.value,
            description: "Direct Transfer",
            timestamp: block.timestamp,
            isInflow: true
        }));
        emit Inflow(msg.sender, msg.value, "Direct Transfer");
    }

    function getTransactions() external view returns (Transaction[] memory) {
        return transactions;
    }

}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAAcountPool {
    enum RuleType {
        INFLOW, // Payment, Donation
        OUTFLOW // Expense, Refund
    }

    struct Rule {
        uint256 id;
        string name;
        RuleType ruleType;
        address strategy; // If we use strategy pattern, or just keep it simple for now
        bytes config;
        bool active;
    }

    struct Transaction {
        uint256 id;
        address initiator;
        uint256 amount;
        string description;
        uint256 timestamp;
        bool isInflow;
    }

    event Joined(address indexed participant);
    event RuleAdded(uint256 indexed ruleId, string name, RuleType ruleType);
    event Inflow(address indexed sender, uint256 amount, string reason);
    event Outflow(address indexed recipient, uint256 amount, string reason);
    event OrganizerAdded(address indexed organizer);

    function initialize(address _creator, string memory _name, string memory _description) external;
    function deposit(string memory reason) external payable;
    function withdraw(address to, uint256 amount, string memory reason) external;
    function addOrganizer(address organizer) external;
    function isOrganizer(address account) external view returns (bool);
    function getBalance() external view returns (uint256);
}

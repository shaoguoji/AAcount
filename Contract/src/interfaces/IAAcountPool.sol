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
        RuleType ruleType; // 0: INFLOW, 1: OUTFLOW
        uint256 amount; // Fixed amount for INFLOW, or Max amount for OUTFLOW (optional usage)
        string description;
        bool active;
    }

    enum ActivityType {
        DEPOSIT,
        WITHDRAW,
        ADD_ORGANIZER,
        JOIN
    }

    struct Transaction {
        uint256 id;
        address initiator;
        uint256 amount;
        string description;
        uint256 timestamp;
        ActivityType activityType;
        uint256 relatedRuleId; // 0 if none
    }

    event Joined(address indexed participant);
    event RuleAdded(uint256 indexed ruleId, string name, RuleType ruleType, uint256 amount);
    event Inflow(address indexed sender, uint256 amount, string reason);
    event Outflow(address indexed recipient, uint256 amount, string reason);
    event OrganizerAdded(address indexed organizer);

    function initialize(address _creator, string memory _name, string memory _description) external;
    function deposit(string memory reason) external payable;
    function depositForRule(uint256 ruleId, string memory reason) external payable;
    function withdraw(address to, uint256 amount, string memory reason) external;
    function addOrganizer(address organizer) external;
    function createRule(string memory name, RuleType ruleType, uint256 amount, string memory description) external;
    function isOrganizer(address account) external view returns (bool);
    function getOrganizers() external view returns (address[] memory);
    function getRules() external view returns (Rule[] memory);
    function getBalance() external view returns (uint256);
}

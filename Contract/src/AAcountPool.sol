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

    address[] public organizerList;

    Rule[] public rules;

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
        organizerList.push(_creator);
    }

    function deposit(string memory reason) external payable { 
        require(msg.value > 0, "Amount must be > 0");
        _handleDeposit(msg.sender, msg.value, reason, 0);
    }

    function depositForRule(uint256 ruleId, string memory reason) external payable {
        require(msg.value > 0, "Amount must be > 0");
        require(ruleId < rules.length, "Invalid Rule ID");
        require(rules[ruleId].ruleType == RuleType.INFLOW, "Not INFLOW rule");
        require(rules[ruleId].active, "Rule not active");
        
        // If rule has specific amount, validation could happen here, or flexible.
        // For now, let's just record it.

        _handleDeposit(msg.sender, msg.value, reason, ruleId);
    }

    function _handleDeposit(address sender, uint256 amount, string memory reason, uint256 ruleId) internal {
        if (!participants[sender]) {
            participants[sender] = true;
            emit Joined(sender);
            
            transactions.push(Transaction({
                id: transactions.length,
                initiator: sender,
                amount: 0,
                description: "Joined Pool",
                timestamp: block.timestamp,
                activityType: ActivityType.JOIN,
                relatedRuleId: 0
            }));
        }

        transactions.push(Transaction({
            id: transactions.length,
            initiator: sender,
            amount: amount,
            description: reason,
            timestamp: block.timestamp,
            activityType: ActivityType.DEPOSIT,
            relatedRuleId: ruleId
        }));

        emit Inflow(sender, amount, reason);
    }

    function withdraw(address to, uint256 amount, string memory reason) external onlyOrganizer {
        require(address(this).balance >= amount, "Insufficient balance");
        
        (bool sent, ) = payable(to).call{value: amount}("");
        require(sent, "Failed to send Ether");

        transactions.push(Transaction({
            id: transactions.length,
            initiator: msg.sender, 
            amount: amount,
            description: reason,
            timestamp: block.timestamp,
            activityType: ActivityType.WITHDRAW,
            relatedRuleId: 0
        }));

        emit Outflow(to, amount, reason);
    }

    function addOrganizer(address organizer) external onlyCreator {
        require(!organizers[organizer], "Already organizer");
        organizers[organizer] = true;
        organizerList.push(organizer);
        
        transactions.push(Transaction({
            id: transactions.length,
            initiator: msg.sender,
            amount: 0,
            description: "Added Organizer",
            timestamp: block.timestamp,
            activityType: ActivityType.ADD_ORGANIZER,
            relatedRuleId: 0
        }));

        emit OrganizerAdded(organizer);
    }

    function createRule(string memory _name, RuleType _ruleType, uint256 _amount, string memory _description) external onlyOrganizer {
        // Allow organizers to create rules? Idea says creator sets rules, mostly. 
        // Let's allow organizers for flexibility or restrict to creator. 
        // Plan said "Allows Creator/Organizer". Contract shows onlyCreator for addOrganizer.
        // Let's use onlyOrganizer for flexibility sharing.
        
        rules.push(Rule({
            id: rules.length,
            name: _name,
            ruleType: _ruleType,
            amount: _amount,
            description: _description,
            active: true
        }));

        emit RuleAdded(rules.length - 1, _name, _ruleType, _amount);
    }

    function isOrganizer(address account) external view returns (bool) {
        return organizers[account];
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Fallback
    receive() external payable {
        // Direct transfer treated as generic deposit
        _handleDeposit(msg.sender, msg.value, "Direct Transfer", 0);
    }

    function getTransactions() external view returns (Transaction[] memory) {
        return transactions;
    }

    function getOrganizers() external view returns (address[] memory) {
        return organizerList;
    }

    function getRules() external view returns (Rule[] memory) {
        return rules;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AAcountFactory.sol";
import "../src/AAcountPool.sol";

contract AAcountTest is Test {
    AAcountFactory public factory;
    AAcountPool public pool;
    address public creator = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    function setUp() public {
        vm.startPrank(creator);
        factory = new AAcountFactory();
        address poolAddr = factory.createPool("Test Pool", "Test Description");
        pool = AAcountPool(payable(poolAddr));
        vm.stopPrank();
    }

    function test_Initialization() public {
        assertEq(pool.name(), "Test Pool");
        assertEq(pool.description(), "Test Description");
        assertEq(pool.creator(), creator);
        assertTrue(pool.isOrganizer(creator));
    }

    function test_Deposit() public {
        vm.deal(user1, 1 ether);
        vm.startPrank(user1);
        pool.deposit{value: 0.5 ether}("Event Fee");
        vm.stopPrank();

        assertEq(address(pool).balance, 0.5 ether);
        assertEq(pool.getBalance(), 0.5 ether);
    }

    function test_Withdraw() public {
        // Setup balance
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        pool.deposit{value: 1 ether}("Donation");

        // Withdraw by creator (organizer)
        uint256 startBal = user2.balance;
        vm.startPrank(creator);
        pool.withdraw(user2, 0.4 ether, "Expense Reimbursement");
        vm.stopPrank();

        assertEq(user2.balance, startBal + 0.4 ether);
        assertEq(pool.getBalance(), 0.6 ether);
    }

    function test_AddOrganizer() public {
        vm.startPrank(creator);
        pool.addOrganizer(user1);
        vm.stopPrank();

        assertTrue(pool.isOrganizer(user1));
    }
}

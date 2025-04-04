// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedBank {
    
    mapping(address => uint256) private balances;

    
    event Deposit(address indexed user, uint256 amount);

    
    event Withdraw(address indexed user, uint256 amount);

   
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        
        balances[msg.sender] -= amount;

        
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");

        emit Withdraw(msg.sender, amount);
    }

    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    
    function getTotalBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

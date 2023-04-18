// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@aave/protocol-v2/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
import "@aave/protocol-v2/contracts/interfaces/IFlashLoanReceiver.sol";
contract FlashLoan is FlashLoanReceiverBase { 
    constructor(address _addressProvider) FlashLoanReceiverBase(_addressProvider)
     {} 
     
     function executeOperation( address _reserve, uint256 _amount, uint256 _fee, bytes calldata _params ) external override { 
        // Your logic goes here
        
         } 
         
         function flashLoan( address _asset, uint256 _amount ) external { 
                address receiverAddress = address(this);
                address[] memory assets = new address[](1); 
                assets[0] = _asset;
                uint256[] memory amounts = new uint256[](1); 
                amounts[0] = _amount;
                uint256[] memory modes = new uint256[](1);
                modes[0] = 0;
                address onBehalfOf = address(this); 
                bytes memory params = abi.encode(_asset, _amount); 
                uint16 referralCode = 0;
                ILendingPool(addressProvider.getLendingPool()).flashLoan( receiverAddress, assets, amounts, modes, onBehalfOf, params, referralCode );
               
                }}
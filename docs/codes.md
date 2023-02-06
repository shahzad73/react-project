
# Basic Wallet Connect Code of page
-------------------------------

import '../App.css';
import React from 'react';
import { useState, } from "react";
import { Button, Input } from 'semantic-ui-react'
import { Icon, Label } from 'semantic-ui-react'
import useWalletConnect from "../components/useWalletConnect";


const Ethereum = () => {

    const [ connectWallet, 
        disConnectWallet, 
        isWeb3WalletConnected, 
        web3WalletConnection, 
        web3WalletCurrentAccount,
        currentWeb3WalletConnectChainID,
        currentWeb3WalletConnectChainName
      ] = useWalletConnect("goerli", "dark", 1, "https://eth-goerli.g.alchemy.com/v2/t4I2C_2QN-uTLjmmUpflVG4Oc5XvLddg");
    

      const connectWeb3Wallet = async () => {
        connectWallet();
      };      

    return (
        <div>
            
            {!isWeb3WalletConnected ? (

                <div>
                    Wallet Connect
                    <br /><br />
                    <Button onClick={connectWeb3Wallet}>Connect Wallet</Button>
                </div>

            ) : (

                <div>
                    Wallet is connected
                </div>

            )}

        </div>
      );
}


export default Ethereum;

-------------------------------











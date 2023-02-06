import React, { FC, useMemo, useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';



import idl from '../data/idl.json';

import { Program, AnchorProvider, web3 } from '@project-serum/anchor';


// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const SolanaComponent = () => {

    const { SystemProgram, Keypair } = web3;
    const opts = {
      preflightCommitment: "processed"
    }    

    const wallet = useWallet();

    async function getProvider() {
      /* create the provider and return it to the caller */
      /* network set to local network for now */
      const network = "http://127.0.0.1:8899";
      const connection = new Connection(network, opts.preflightCommitment);
    
      const provider = new AnchorProvider(
        connection, wallet, opts.preflightCommitment,
      );
      return provider;
    }



    const baseAccount = Keypair.generate();
    const[currentRandomAccount, setCurrentRandomAccount] = useState( baseAccount )


    const programID = new PublicKey(idl.metadata.address);
    const [currentCounterValue, setCurrentCounterValue] = useState(null);

    
    async function createCounterRandomCounterProgram() {    
      const provider = await getProvider();
      /* create the program interface combining the idl, program ID, and provider */
      const program = new Program(idl, programID, provider);

      try {
        /* interact with the program via rpc */

        await program.rpc.create({
          accounts: {
            baseAccount: currentRandomAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [currentRandomAccount]
        });

        const account = await program.account.baseAccount.fetch(currentRandomAccount.publicKey);
        setCurrentCounterValue(account.count.toString());
      } catch (err) {
        console.log("Transaction error: ", err);
      }
    }
  
    async function incrementRandomCounterProgram() {
      const provider = await getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.increment({
        accounts: {
          baseAccount: currentRandomAccount.publicKey
        }
      });
      
      const account = await program.account.baseAccount.fetch(currentRandomAccount.publicKey);
      console.log('account: ', account);
      setCurrentCounterValue(account.count.toString());
    }    


    return (
            <span>
                    Use following methods to interact with wallet once connected
                    <br />
                    The sendTransaction, signTransaction, signAllTransactions and signMessage methods enable us to sign messages and/or transactions on              
                    <br /><br />
                     <WalletMultiButton />
                    { wallet.connected && (<span> <WalletDisconnectButton />  <br /><br />  </span>  ) }                    
                    <br />
                    { wallet.ready && ( <span> Ready <br /></span> )} 
                    { wallet.connected && ( <span> Connected <br /></span> )} 
                    { wallet.connecting && ( <span> Connecting <br /></span> )} 
                    { wallet.disconnecting && ( <span> disconnecting<br /> </span> )} 
                    { !wallet.connected && ( <span> Dis-Connected </span> )}

                    <br /><br /><hr /><br />

                    <h3>Counter Example</h3>
                    <br />
                    <b>Currently Selected Random Account</b>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {currentRandomAccount.publicKey.toString()}
                    <br /><br />


                    <div>

                      {
                        currentCounterValue && currentCounterValue >= Number(0) ? (
                          <span>
                            <Button onClick={incrementRandomCounterProgram}>Increment counter</Button>
                            <br />
                            <span>Current Counter Value : <b>{currentCounterValue}</b></span>
                          </span>
                        ) : (
                          <span>
                            <b>Create the counter.</b> &nbsp; 
                            <Button onClick={createCounterRandomCounterProgram}>Create counter</Button>
                          </span>
                        )
                      }
                    </div>

                    <br /><br /><hr /><br />                    

            </span>

    );
};



const Solana = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Testnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
        ],
        [network]
    );

  return(
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
              <SolanaComponent />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  )

};


export default Solana;
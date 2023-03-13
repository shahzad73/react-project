import '../App.css';
import React from 'react';

import { WagmiConfig, createClient, configureChains, mainnet, goerli } from 'wagmi'
 
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'


import { useDebounce } from 'use-debounce'
import { utils } from 'ethers'
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
  usePrepareContractWrite,
  useContractWrite,
  useToken
} from 'wagmi'


const Ethereum = () => {

  // Configure chains & providers with the Alchemy provider.
  // Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
  const { chains, provider, webSocketProvider } = configureChains(
    [goerli],
    [alchemyProvider({ apiKey: 't4I2C_2QN-uTLjmmUpflVG4Oc5XvLddg' }), publicProvider()],
  )


  // Set up client
  const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: 'wagmi',
          },
        }),
        new WalletConnectConnector({
          chains,
          options: {
            qrcode: true,
          },
        }),
        new InjectedConnector({
          chains,
          options: {
            name: 'Injected',
            shimDisconnect: true,
          },
        }),
    ],
    provider,
    webSocketProvider,
  })

  return (
      <div>
          <WagmiConfig client={client}>
              <TokenInfo />
              <br /><br />              
              <WalletConnectComponent />
              <br /><br />
              <SendETHComponent />
              <br /><br />
              <MintTokensInERC1404 />
          </WagmiConfig>
      </div>
  );

}

export function WalletConnectComponent() {

  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
 


  if (isConnected) {
    return (
      <div>
        
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <button onClick={disconnect}>Disconnect</button>
        <br />
        <br />
        <div>
            Connected to {address} <br />
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>    
      </div>      
    )
  }

  return (
    <div>
      <h3>Wallet Connect V3</h3>
      Here is the link <br />   https://wagmi.sh/examples/send-transaction
      <br /><br />

      {connectors.map((connector) => (
          <span>
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >

              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading && connector.id === pendingConnector?.id && ' (connecting)' }

          </button>
          <br /><br />
          </span>
      ))}
 
      <br /><br />      
      {error && <div>{error.message}</div>}
    </div>
  )

}



function SendETHComponent() {
  
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

  const [to, setTo] = React.useState('')
  const [debouncedTo] = useDebounce(to, 500)
 
  const [amount, setAmount] = React.useState('')
  const [debouncedAmount] = useDebounce(amount, 500)

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  })
  const { data, sendTransaction } = useSendTransaction(config)
 
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  

  if (isConnected) {
      return (
          <span>

                  <br /><br />
                  <h4>Send ETH to other address</h4>
                  <form onSubmit={(e) => { e.preventDefault()
                      sendTransaction?.()
                    }}>

                        Address : <input
                          aria-label="Recipient"
                          onChange={(e) => setTo(e.target.value)}
                          placeholder="0xA0Cf…251e"
                          value={to}
                          width="200"
                        />
                        <br />
                        Amount : <input
                          aria-label="Amount (ether)"
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.05"
                          value={amount}
                        />
                        <br /><br />
                        <button disabled={isLoading || !to || !amount}>
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {isLoading} - {sendTransaction} - {to} - {amount}

                        {isSuccess && (
                          <div>
                            Successfully sent {amount} ether to {to}
                            <div>
                              <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                            </div>
                          </div>
                        )}

                  </form>       



          </span>
      )
  } else {
      return (      
        <span>
          <h4>Send ETH to address</h4>
          Not Connected
        </span>
      );
  }

}


function MintTokensInERC1404 () {

  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, pendingConnector } = useConnect();


  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: '0xaB719f67AAD0B17883616489967dfacd4D5E7851',
    abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "mint",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
    ],
    functionName: 'mint',
  })
  const { data, error, isError, write } = useContractWrite(config)
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
 

  if( isConnected ) {

        return (
          <div>
            <br />
            <h4>Mint Tokens in ERC1404</h4>

            <button disabled={!write || isLoading} onClick={() => write()}>
              {isLoading ? 'Minting...' : 'Mint'}
            </button>
            {isSuccess && (
              <div>
                Successfully minted your NFT!
                <div>
                  <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                </div>
              </div>
            )}
            {(isPrepareError || isError) && (
              <div>Error: {(prepareError || error)?.message}</div>
            )}
          </div>
        )

    } else {

        return (      
          <span>
            <br />
            <h4>Mint Tokens in ERC1404</h4>
            Not Connected
          </span>
        );  

    }
        
}


function TokenInfo() {

  const { data, isError, isLoading } = useToken({
    address: '0x596C5723aa877b3353fBEC04385b0c9505A9e42F',
    onSuccess(data) {
      console.log('Success', data)
    }    
  });


  <h3>Token Info</h3>
  if (isLoading) return <div>Fetching token…</div>
  if (isError) return <div>Error fetching token info</div>
  return (
      <div>      
          Token: {data?.symbol}
          <br />
          Decimals:  {data?.decimals}
          <br />
          Name: {data?.name}
      </div>
  )

}



export default Ethereum;
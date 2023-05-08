# Pay3 DApp deployed at Celestia Network using Ethermint Rollup
Pay3 is a smart contract based subscription payment system. User can start and stop the subscription easily. Service provider can use this system to collect and withdraw service fees.

## Project Description
Pay3 is a smart contract based payment system. Service provider can start subscription after deploying this contract.

- Users can be charged with prepaid way to NFT as their own virtual wallet and quickly stop/start subscription.

They can also withdraw their amount at any time but the service fee of `0.01ETH` will be deducted and collected by the owner's account.

### User experience

Steps to create a virtual wallet:

- Create

- Pushing Charge button after allocating a ceration amount of `ETH`(for example:over 0.01ETH)

- Pushing On button

Steps to withdraw allocated amount:
- Pushing Off button
- Pushing Withdraw


## Conclusion

The Single Contract configuration allows for customization, and a subscription system can be prepared for each service, making it possible to tailor operations to the characteristics of the service.

we hope to promote the use of this infrastructure and reduce the number of subscription services with cumbersome cancellation procedures.

## How it's Made

- Technical points

By using NFT, virtual wallets can be created at a lighter weight than Acount Abstraction, and can be deployed and used on a per-service basis. There is no need to create a new wallet.

And by treating NFTs as virtual wallets, it is easy to transfer the right to subscribe itself to others.

The Single Contract configuration allows for customization and preparation of a system of subscriptions for each service, enabling operations tailored to the characteristics of the service.
## Setup
1. Run a Celestia full storage node by following their [official](https://docs.celestia.org/nodes/full-storage-node/) docs
2. Setup Ethermint Rollup
```
git clone https://github.com/celestiaorg/ethermint.git
cd ethermint
make install
```
With a Celestia Light Node running in one terminal session, we can proceed to generate the Ethermint rollup.

In the ethermint directory, we have a helpful bash script that allows you to instantiate a local Ethermint sovereign rollup on Celestia.

Run the following:

`bash init.sh`

This bash script does everything needed to initialize your Ethermint rollup.

Setup these environment variables to start the Ethermint Rollup:

```
NAMESPACE_ID=$(openssl rand -hex 8)
DA_BLOCK_HEIGHT=$(curl https://rpc-blockspacerace.pops.one/block | jq -r '.result.block.header.height')
```
With this setup complete, we can now start our Ethermint Rollup in the same terminal session:
```
ethermintd start --rollkit.aggregator true --rollkit.da_layer celestia --rollkit.da_config='{"base_url":"http://localhost:26659","timeout":60000000000,"gas_limit":6000000,"fee":6000}' --rollkit.namespace_id $NAMESPACE_ID --rollkit.da_start_height $DA_BLOCK_HEIGHT 
```
3. Deploy `Pay3` contracts:
```
git clone https://github.com/mzaryabrafique/pay3.git
cd pay3
npm install
truffle compile && truffle deploy
```
Update the `Pay3` contract address to the `/client/src/utils/contractAddress.json`
and replace the `client/src/utils/Pay3.json` with the `build/contracts/Pay3.json`
4. Assuming that the Celestia and Ethermint Rollup nodes are running, start the frontend to interact with the contracts. In the `pay3` root directory, run these commands: 
```
cd client
npm install
npm start
```
This will start the frontend at `localhost:3001`

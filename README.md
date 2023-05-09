# Pay3 DApp deployed at Celestia Network using Ethermint Rollup
Pay3 is a smart contract based subscription payment system. User can start and stop the subscription easily. Service provider can use this system to collect and withdraw service fees.

## Project Description
Pay3 is a smart contract based payment system. There are two panels to this DApp, one for the users and the other for the `Admin`. Users can create virtual wallets from their interface, allocate some amount to the wallet and withdraw it whenever they want after paying the subscription fee of `0.01ETH`. The service providers can start subscription and collect the subscription fee after deploying this contract.

- Users can be charged with prepaid way to NFT as their own virtual wallet and quickly stop/start subscription.
- They can also withdraw their amount at any time but the service fee of `0.01ETH` will be deducted and collected by the owner's account.

### User experience

Steps to create a virtual wallet:
- To create a virtual wallet, the user needs to first allocate a certain amount of `Ethereum (ETH)` to the wallet. This can be done by pushing the `Charge` button and entering the desired amount of `ETH` to be allocated. It is important to note that the amount allocated must be over `0.01 ETH`.
- Once the desired amount of `ETH` has been allocated, the user can push the `On` button to activate the wallet and start using it to store and withdraw their allocated amount.

Steps to withdraw allocated amount:
- To withdraw the allocated amount, the user needs to first push the `Off` button to deactivate the wallet. 
- Then, they can push the `Withdraw` button to initiate the withdrawal process.
- The allocated amount would be re-imbursed to the user's metamask wallet.

Steps to collect the Subscription fee (by `Admin`):
- The `Admin` would have to switch to the wallet that was used to deploy the contracts in order to collect the subscription fee.
- To collect the subsctiption fee, push the `Collect` button and then press the `Withdraw` button to transfer the collected amount to the Admin's metamask wallet.


## Conclusion

The subscription system allows users to subscribe to the service and pay for it on a regular basis. This makes it convenient for users to use the service without having to worry about renewing their subscription manually.

This DApp aims to reduce the number of subscription services with cumbersome cancellation procedures. This means that users can cancel their subscription easily without going through complex processes, making it easier to switch between services or cancel services that are no longer required.

Overall, this DApp is designed to provide users with greater flexibility and customization in the services they use, while also making it easier to manage their subscriptions. This can help businesses to attract and retain customers by providing a more personalized and convenient service, ultimately leading to increased customer satisfaction and loyalty.

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

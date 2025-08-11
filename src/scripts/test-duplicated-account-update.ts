import { config as dotenv } from "dotenv";
dotenv();

import {
  AccountUpdate,
  Bool,
  Field,
  Mina,
  PrivateKey,
  UInt64,
  UInt8,
} from "o1js";
import { BasicTransfer } from "../contracts/BasicTransfer.js";

async function main() {
  console.log("Compiling BasicTransfer...");
  await BasicTransfer.compile();

  const Network = Mina.Network(
    `https://api.minascan.io/node/${process.env.NETWORK || "devnet"}/v1/graphql`
  );
  Mina.setActiveInstance(Network);

  const deployerPrivateKey = PrivateKey.fromBase58(process.env.PRIVATE_KEY!);
  const deployerAddress = deployerPrivateKey.toPublicKey();

  const fee = 100_000_000;

  console.log("Deployer Address:", deployerAddress.toBase58());

  const contracts: BasicTransfer[] = [];

  // Create 2 instances of the basic transfer contract
  for (let i = 0; i < 2; i++) {
    async function deploy() {
      // Create a new instance of the contract
      const { privateKey: contractPrivateKey, publicKey: contractAddress } =
        PrivateKey.randomKeypair();

      const contract = new BasicTransfer(contractAddress);

      console.log("Contract Address:", contractAddress.toBase58());

      const deployTx = await Mina.transaction(
        {
          sender: deployerAddress,
          fee,
        },
        async () => {
          AccountUpdate.fundNewAccount(deployerAddress, 1);
          const update = AccountUpdate.createSigned(deployerAddress);
          update.send({
            to: contractAddress,
            amount: 1100000000,
          });
          await contract.deploy();
        }
      );
      await deployTx.prove();
      const pendingTx = await deployTx
        .sign([contractPrivateKey, deployerPrivateKey])
        .send();
      await pendingTx.wait();

      return contract;
    }

    contracts.push(await deploy());
  }

  // Sent token back to the deployer address
  {
    console.log("Sending MINA to the deployer address");
    const sendTx = await Mina.transaction(
      {
        sender: deployerAddress,
        fee: fee,
      },
      async () => {
        await contracts[0].transfer(deployerAddress, UInt64.from(300000000));
        await contracts[1].transfer(deployerAddress, UInt64.from(300000000));
      }
    );
    await sendTx.prove();
    const pendingTx = await sendTx.sign([deployerPrivateKey]).send();

    console.log("Tx hash:", pendingTx.hash);

    await pendingTx.wait();
    console.log("MINA sent");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

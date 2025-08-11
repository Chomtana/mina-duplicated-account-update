# Mina Duplicated Account Update

Mina duplicated account update has a critical bug: if 0.3 MINA is sent to the same address from two different zkApps, only 0.3 MINA is credited instead of 0.6 MINA, but 0.3 MINA is deducted from each zkApp (–0.6 MINA, +0.3 MINA).

## Deployed zkApps
* zkApp 1: [B62qregr1kxMPfSGaqq3FGBBYDiU9gqxUY81dNRrbk6p1jWdMY6U7UN](https://minascan.io/devnet/account/B62qregr1kxMPfSGaqq3FGBBYDiU9gqxUY81dNRrbk6p1jWdMY6U7UN/zk-txs)
* zkApp 2: [B62qpsPYoyNvhcytSx46c3zJspDGtHyFtkN491BPsnzKGisaAqfadaG](https://minascan.io/devnet/account/B62qpsPYoyNvhcytSx46c3zJspDGtHyFtkN491BPsnzKGisaAqfadaG/zk-txs)

## Duplicated Transfer Tx
https://minascan.io/devnet/tx/5JvEewS1yyitS2WeCm8wMK7P7X39xZeVTrSQ2ASnVtREr4e4SAtp

This transaction initiate transfer of 0.3 MINA from each contract to the same wallet

```typescript
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
```

## Result

### 0.3 MINA deducted from each zkApp (Total -0.6 MINA)

Each contract starts with 1.1 MINA; after the transaction, it has 0.8 MINA (−0.3 MINA)

<img width="2704" height="1390" alt="image" src="https://github.com/user-attachments/assets/444710d8-89b6-4ae4-b514-fc0d32b3e583" />

<img width="1366" height="678" alt="image" src="https://github.com/user-attachments/assets/764a8a2a-f862-45e7-8b21-6fe3479ec209" />

### Only 0.3 MINA credited to the wallet (+0.3 MINA)

Only 0.2 MINA (0.3 MINA received - 0.1 MINA fee) credited back to the wallet as a result of that transaction

<img width="855" height="282" alt="image" src="https://github.com/user-attachments/assets/d670cdca-edc5-408f-a209-d45ec6875605" />


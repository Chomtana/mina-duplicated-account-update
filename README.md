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

### Only 0.3 MINA credited to the wallet (+0.3 MINA)

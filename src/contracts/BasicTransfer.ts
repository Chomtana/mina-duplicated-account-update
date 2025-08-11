import {
  Field,
  SmartContract,
  method,
  PublicKey,
  UInt64,
  Struct,
  Permissions,
} from "o1js";

export class BasicTransfer extends SmartContract {
  async deploy() {
    super.deploy();

    // make account non-upgradable forever
    this.account.permissions.set({
      ...Permissions.default(),
      setVerificationKey:
        Permissions.VerificationKey.impossibleDuringCurrentVersion(),
      setPermissions: Permissions.impossible(),
      access: Permissions.proofOrSignature(),
    });
  }

  events = {
    Transfer: Struct({ to: PublicKey, amount: UInt64 }),
  };

  @method async transfer(to: PublicKey, amount: UInt64) {
    this.send({ to, amount });
    this.emitEvent("Transfer", { to, amount });
  }
}

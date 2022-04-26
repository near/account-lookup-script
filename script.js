const fs = require("fs");
const BN = require("bn.js");
const sha256 = require("js-sha256");
const { viewLockupAccount, viewAccountBalance } = require("near-lockup-helper");

// *** SET HERE DESIRED block_id ***
//const blockReference = { block_id: 19145907 }; // block when opgran01.near received the lockup contract (October 14, 2020)
//const blockReference = { block_id: 27402367 }; // block when opgran01.near transferred all the unlocked tokens (January 12, 2021)
const blockReference = { block_id: 27402703 }; // block when opgran01.near transferred 1M tokens (January 12, 2021)
//const blockReference = { finality: 'final' }

const nearRpcConnectionConfig = {
  nodeUrl: "https://archival-rpc.mainnet.near.org",
};

const fromYocto = new BN("1000000000000000000000000");

function accountToLockup(masterAccountId, accountId) {
  return `${sha256(Buffer.from(accountId))
    .toString("hex")
    .slice(0, 40)}.${masterAccountId}`;
}

async function main() {
  try {
    const data = fs.readFileSync("foundation.txt", "utf8");
    let ownerAccountIds = data.split("\n");
    console.log(
      `account_id,owners_liquid_balance,lockup_liquid_balance,lockup_total_balance,lockup_locked_balance`
    );
    for (const ownerAccountId of ownerAccountIds) {
      if (ownerAccountId === "") {
        continue;
      }

      const lockupAccountId = accountToLockup("lockup.near", ownerAccountId);
      try {
        const lockupInfo = await viewLockupAccount(
          lockupAccountId,
          nearRpcConnectionConfig,
          blockReference
        );
        console.log(
          `${ownerAccountId},${lockupInfo.ownerAccountBalance.div(fromYocto)},${lockupInfo.liquidAmount.div(fromYocto)},${lockupInfo.liquidAmount.add(lockupInfo.lockedAmount).div(fromYocto)},${lockupInfo.lockedAmount.div(fromYocto)}`
        );
      } catch (err) {
        const ownerAccountInfo = await viewAccountBalance(
          ownerAccountId,
          nearRpcConnectionConfig,
          blockReference
        );
        console.log(
          `${ownerAccountId},${new BN(ownerAccountInfo.amount).div(fromYocto)},,,`
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

main();

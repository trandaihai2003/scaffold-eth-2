import { ethers } from "ethers";
import { parse, stringify } from "envfile";
import * as fs from "fs";

const envFilePath = "./.env";

const setNewEnvConfig = async (existingEnvConfig = {}) => {
  console.log("👛 Generating new Wallet\n");
  const randomWallet = ethers.Wallet.createRandom();

  // Use a default password for non-interactive deployment
  const defaultPassword = "scaffold-eth-2-deploy";
  const encryptedJson = await randomWallet.encrypt(defaultPassword);

  const newEnvConfig = {
    ...existingEnvConfig,
    DEPLOYER_PRIVATE_KEY_ENCRYPTED: encryptedJson,
  };

  // Store in .env
  fs.writeFileSync(envFilePath, stringify(newEnvConfig));
  console.log("\n📄 Encrypted Private Key saved to packages/hardhat/.env file");
  console.log("🪄 Generated wallet address:", randomWallet.address, "\n");
  console.log("⚠️ Using default password for deployment: scaffold-eth-2-deploy");
  console.log("⚠️ This is for development/demo purposes only!");
};

async function main() {
  if (!fs.existsSync(envFilePath)) {
    // No .env file yet.
    await setNewEnvConfig();
    return;
  }

  const existingEnvConfig = parse(fs.readFileSync(envFilePath).toString());
  if (existingEnvConfig.DEPLOYER_PRIVATE_KEY_ENCRYPTED) {
    console.log("⚠️ You already have a deployer account. Check the packages/hardhat/.env file");
    return;
  }

  await setNewEnvConfig(existingEnvConfig);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

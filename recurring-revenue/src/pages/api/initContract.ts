// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { contractId } from "@/constants/contract";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const execSync = require("child_process").execSync;
  // import { execSync } from 'child_process';  // replace ^ if using ES modules

  let output;

  try {
    output = execSync(
      `soroban invoke \
      --id ${contractId} \
      --secret-key ${req.query.sender} \
      --rpc-url http://localhost:8000/soroban/rpc \
      --network-passphrase 'Test SDF Future Network ; October 2022' \
      --fn init \
      --arg '{"object":{"account_id":{"public_key_type_ed25519":"94b415568a53ca1dcfde2473c116d5e86b10f68b68a7636773c213f587717866"}}}' \
      --arg a9ab643486dc0dbcdc1485e6589e8bb3bcbbd8e69ad66c703556b4d6645a6dc8 \
      --arg $(($(date +'%s') + 100)) \
      --arg 10 \
      --arg 86400`,
      { encoding: "utf-8" }
    ); // the default is 'buffer'
  } catch (e) {
    console.log("error!");
    console.error(e);
  }
  console.log(1);
  console.log(output);
  const splitted = output.split(/\r?\n/);
  const filtered = splitted.filter((e: any) => {
    return e !== "";
  });

  console.log(filtered);

  res.status(200).json(JSON.stringify(filtered));
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

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
      --id 6efd4d3ad1e1951482565e664981d0d85b73f0c40cd113fa3a093f6eb637b135 \
      --secret-key ${req.query.sender} \
      --rpc-url http://localhost:8000/soroban/rpc \
      --network-passphrase 'Test SDF Future Network ; October 2022' \
      --fn withdraw`,
      { encoding: "utf-8" }
    ); // the default is 'buffer'
  } catch (e) {
    console.log("error!");
    console.error(e);
  }
  const splitted = output.split(/\r?\n/);
  const filtered = splitted.filter((e: any) => {
    return e !== "";
  });

  console.log(filtered);

  res.status(200).json(JSON.stringify(filtered));
}

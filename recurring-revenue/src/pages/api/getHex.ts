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

  const output = execSync(
    `docker run stellar/stellar-core convert-id ${req.query.publicKey}`,
    { encoding: "utf-8" }
  ); // the default is 'buffer'

  const splitted = output.split(/\r?\n/);
  const filtered = splitted.filter((e: any) => {
    return e !== "";
  });

  res.status(200).json(JSON.stringify(filtered));
}

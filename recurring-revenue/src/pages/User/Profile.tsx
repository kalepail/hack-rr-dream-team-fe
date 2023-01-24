import React, { useEffect, useState } from "react";
import createStellarIdenticon from "stellar-identicon-js";
import * as SorobanSDK from "soroban-client";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { contractId, baseFee } from "@/constants/contract";
import { truncateString } from "@/helpers/stellar";
import { useSorobanReact } from "@soroban-react/core";
import { ContractValueType, useContractValue } from "@soroban-react/contracts";
import * as SorobanClient from "soroban-client";
let xdr = SorobanClient.xdr;

import layoutStyles from "@/styles/Layout.module.css";
import userStyles from "@/styles/User.module.css";

const contractIdentifier = (contract: Buffer): SorobanClient.xdr.ScVal => {
  return xdr.ScVal.scvObject(
    xdr.ScObject.scoVec([
      xdr.ScVal.scvSymbol("Contract"),
      xdr.ScVal.scvObject(xdr.ScObject.scoBytes(contract)),
    ])
  );
};

async function fetchContractValue(
  server: SorobanClient.Server,
  networkPassphrase: string,
  contractId: string,
  method: string,
  ...params: SorobanClient.xdr.ScVal[]
): Promise<SorobanClient.xdr.ScVal> {
  const contract = new SorobanClient.Contract(contractId);
  // TODO: Optionally include the wallet of the submitter here, so the
  // simulation is more accurate
  const source = new SorobanClient.Account(
    "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
    "0"
  );

  const transaction = new SorobanClient.TransactionBuilder(source, {
    // fee doesn't matter, we're not submitting
    fee: "100",
    networkPassphrase,
  })
    .addOperation(contract.call(method, ...params))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const { results } = await server.simulateTransaction(transaction);
  if (!results || results.length !== 1) {
    throw new Error("Invalid response from simulateTransaction");
  }
  const result = results[0];
  return xdr.ScVal.fromXDR(Buffer.from(result.xdr, "base64"));
}

const Profile = () => {
  const sorobanContext = useSorobanReact();

  const [identiconUrl, setIdenticonUrl] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [amount, setAmount] = useState(baseFee);
  const [frequency, setFrequency] = useState("30");
  const [signUpStatus, setSignUpStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const canvas = createStellarIdenticon(publicKey);
    setIdenticonUrl(canvas.toDataURL());
  }, [publicKey]);

  useEffect(() => {
    const pk = localStorage.getItem("publicKey") || "";

    const sk = localStorage.getItem("secretKey") || "";

    setPublicKey(pk);
    setSecretKey(sk);
  }, []);

  const handleSignUp = async () => {
    setSignUpStatus("Creating a keypair for the user");
    setIsLoading(true);
    const kp = SorobanSDK.Keypair.random();
    const pKey = kp.publicKey();
    const sKey = kp.secret();

    try {
      await fetch(
        `https://friendbot-futurenet.stellar.org?addr=${encodeURIComponent(
          pKey
        )}`
      );
    } catch (e) {
      console.error(e);
      throw new Error("Error creating account");
    }

    setTimeout(() => {}, 100);

    const initReq = await fetch(`/api/initContract?sender=${sKey}`);
    setSignUpStatus("Initialize the contract between both parties");
    const r = await initReq.json();
    setIsLoading(false);

    setSecretKey(sKey);
    setPublicKey(pKey);
    localStorage.setItem("publicKey", pKey);
    localStorage.setItem("secretKey", sKey);
    setTimeout(() => {
      setSignUpStatus("");
    }, 1000);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency(e.target.value);
  };

  const submitAmountChange = async () => {
    const initReq = await fetch(
      `/api/changeAmount?amount=${amount}&sender=${secretKey}`
    );
    const r = await initReq.json();
  };
  const submitFrequencyChange = async () => {
    const initReq = await fetch(
      `/api/changeFrequency?step=${frequency}&sender=${secretKey}`
    );
    const r = await initReq.json();
  };

  return (
    <section>
      {isLoading ? (
        <div className={layoutStyles.loader}>
          <div>
            <CircularProgress />
          </div>
        </div>
      ) : null}

      <Container component="main" maxWidth="md">
        <Paper className={layoutStyles.paper} elevation={0}>
          <h1 className={layoutStyles.title}>Your Profile</h1>
          {secretKey ? (
            <div className={userStyles.user}>
              <img className={userStyles.identicon} src={identiconUrl} />
              {truncateString(publicKey)}
            </div>
          ) : null}

          <div className={layoutStyles.balance}>
            <Card sx={{ width: 500 }}>
              <CardContent>
                {secretKey ? (
                  <>
                    {" "}
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Active XLMflix Membership
                    </Typography>
                    <div>
                      <Typography variant="body1">
                        {baseFee} XLM Every 30 Days
                      </Typography>
                      <br />
                      <CardActions>
                        <TextField
                          value={amount}
                          onChange={handleAmountChange}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={submitAmountChange}
                        >
                          Change Amount
                        </Button>
                      </CardActions>
                    </div>
                    <div>
                      <CardActions>
                        <TextField
                          value={frequency}
                          onChange={handleFrequencyChange}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={submitFrequencyChange}
                        >
                          Change Frequency (Days)
                        </Button>
                      </CardActions>
                    </div>
                  </>
                ) : (
                  <>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      XLMflix Membership
                    </Typography>
                    <Typography variant="body1">
                      {baseFee} XLM / month
                    </Typography>
                    <br />
                    <CardActions>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSignUp}
                      >
                        Sign Up!
                      </Button>
                    </CardActions>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </Paper>
      </Container>
    </section>
  );
};

export default Profile;

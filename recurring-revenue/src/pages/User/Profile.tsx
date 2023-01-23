import React, { useEffect, useState } from "react";
import createStellarIdenticon from "stellar-identicon-js";
import * as SorobanSDK from "soroban-client";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { baseFee } from "@/constants/contract";
import { truncateString } from "@/helpers/stellar";

import layoutStyles from "@/styles/Layout.module.css";
import userStyles from "@/styles/User.module.css";

const Profile = () => {
  const [identiconUrl, setIdenticonUrl] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [amount, setAmount] = useState(baseFee);
  const [frequency, setFrequency] = useState("30");

  useEffect(() => {
    const canvas = createStellarIdenticon(publicKey);
    setIdenticonUrl(canvas.toDataURL());
  }, [publicKey]);

  const handleSignUp = async () => {
    const kp = SorobanSDK.Keypair.random();
    const pKey = kp.publicKey();
    const sKey = kp.secret();

    console.log(publicKey);
    console.log(sKey);

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

    const initReq = await fetch(`/api/initContract?sender=${sKey}`);
    const r = await initReq.json();

    setSecretKey(sKey);
    setPublicKey(pKey);
    localStorage.setItem("publicKey", pKey);
    localStorage.setItem("secretKey", sKey);
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

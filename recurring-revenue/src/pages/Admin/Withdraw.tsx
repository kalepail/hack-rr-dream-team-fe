import { useEffect, useState } from "react";
import createStellarIdenticon from "stellar-identicon-js";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { truncateString } from "@/helpers/stellar";

import layoutStyles from "@/styles/Layout.module.css";
import userStyles from "@/styles/User.module.css";

const Withdraw = () => {
  let demoPublicKey = "";
  const [accounts, setAccounts] = useState([demoPublicKey]);
  const [identiconUrl, setIdenticonUrl] = useState("");

  useEffect(() => {
    demoPublicKey = localStorage.getItem("publicKey") || "";

    setAccounts([demoPublicKey]);
  }, []);

  useEffect(() => {
    demoPublicKey = localStorage.getItem("publicKey") || "";

    const canvas = createStellarIdenticon(demoPublicKey);
    setIdenticonUrl(canvas.toDataURL());
  }, []);

  const handleWithdraw = async () => {
    const secretKey = localStorage.getItem("secretKey");
    const initReq = await fetch(`/api/withdraw?sender=${secretKey}`);
    const r = await initReq.json();
  };
  return (
    <section>
      <Container component="main" maxWidth="md">
        <Paper className={layoutStyles.paper} elevation={0}>
          <h1 className={layoutStyles.title}>Withdraw From Users</h1>

          <div className={layoutStyles.balance}>
            <Card sx={{ width: 500 }}>
              <CardContent>
                {accounts.map((acct) => (
                  <div className={layoutStyles.accountRow}>
                    <div className={userStyles.user}>
                      <img
                        className={userStyles.identicon}
                        src={identiconUrl}
                      />
                      {truncateString(accounts[0])}
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      ></Typography>
                    </div>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleWithdraw}
                      >
                        Withdraw
                      </Button>
                    </CardActions>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Paper>
      </Container>
    </section>
  );
};

export default Withdraw;

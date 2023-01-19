import { useEffect, useState } from "react";
import createStellarIdenticon from "stellar-identicon-js";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { userPublicKey } from "@/constants/user";
import { truncateString } from "@/helpers/stellar";

import layoutStyles from "@/styles/Layout.module.css";
import userStyles from "@/styles/User.module.css";

const Withdraw = () => {
  const [accounts, setAccounts] = useState([""]);

  useEffect(() => {
    const accounts = [
      userPublicKey,
      "GALIHSEAEFNABLMMK5E3Q7ACB3XAQXHWBYD5B7DVUV265FSD4ME7BKFX",
      "GAFVTEM4I67J3ETKMGB5UVQ5IPWSAI2K2B3IFRTIWIXG27LREHNYDMUP",
      "GDUPNHEGAM4L22RHI5BOILIIXUVUKKMMVGSRRSQYXWVHP6HLL6HPSNNQ",
    ];
    setAccounts(accounts);
  }, []);

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
                        src={createStellarIdenticon(acct).toDataURL()}
                      />
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {truncateString(acct)}
                      </Typography>
                    </div>
                    <CardActions>
                      <Button variant="contained" size="small">
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

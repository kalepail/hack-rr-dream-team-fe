import { useEffect, useState } from "react";
import createStellarIdenticon from "stellar-identicon-js";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { userPublicKey } from "@/constants/user";
import { truncateString } from "@/helpers/stellar";

import layoutStyles from "@/styles/Layout.module.css";
import userStyles from "@/styles/User.module.css";

const Profile = () => {
  const [identiconUrl, setIdenticonUrl] = useState("");

  useEffect(() => {
    const canvas = createStellarIdenticon(userPublicKey);
    setIdenticonUrl(canvas.toDataURL());
  }, []);

  return (
    <section>
      <Container component="main" maxWidth="md">
        <Paper className={layoutStyles.paper} elevation={0}>
          <h1 className={layoutStyles.title}>Welcome Back!</h1>
          <div className={userStyles.user}>
            <img className={userStyles.identicon} src={identiconUrl} />
            {truncateString(userPublicKey)}
          </div>
          <div className={layoutStyles.balance}>
            <Card sx={{ width: 500 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Total Balance
                </Typography>
                <Typography variant="body1">100000 XLM</Typography>
                <br />
                <CardActions>
                  <Button variant="contained" size="small">
                    Increase Amount
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </div>
        </Paper>
      </Container>
    </section>
  );
};

export default Profile;

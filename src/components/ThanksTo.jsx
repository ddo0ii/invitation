import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import appConfig from "../app.config";

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function AccountList({ title, items }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom ml={2}>
        {title}
      </Typography>
      <List dense>
        {items.map((acc) => (
          <ListItem
            key={acc.label}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="copy"
                onClick={() => copy(`${acc.bank} ${acc.number}`)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText
              primary={acc.label}
              secondary={`${acc.bank} ${acc.number}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function ThanksTo() {
  const [open, setOpen] = useState(false);

  const handleCopyAll = async () => {
    const lines = [
      ...appConfig.accounts.groomSide.map(
        (a) => `${a.label}: ${a.bank} ${a.number}`,
      ),
      ...appConfig.accounts.brideSide.map(
        (a) => `${a.label}: ${a.bank} ${a.number}`,
      ),
    ];
    const ok = await copy(lines.join("\n"));
    setOpen(ok);
  };

  return (
    <Stack spacing={2}>
      <Typography>
        직접 축하를 전하지 못하는 분들을 위해 부득이하게 계좌번호를 기재하게
        되었습니다. 넓은 마음으로 양해 부탁드립니다.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid xs={12} md={6}>
          <AccountList
            title="신랑 측 계좌번호"
            items={appConfig.accounts.groomSide}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <AccountList
            title="신부 측 계좌번호"
            items={appConfig.accounts.brideSide}
          />
        </Grid>
      </Grid>
      <Divider />
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleCopyAll}
          startIcon={<ContentCopyIcon />}
        >
          전체 복사
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={() => setOpen(false)}
        message="복사되었습니다"
      />
    </Stack>
  );
}

export default ThanksTo;

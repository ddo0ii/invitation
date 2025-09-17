import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./ThanksTo.css";
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
    <Accordion disableGutters className="thanks__acc">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
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
      </AccordionDetails>
    </Accordion>
  );
}

function ThanksTo() {
  const [open, setOpen] = useState(false);
  
  return (
    <Stack className="thanks" spacing={2}>
      <Typography className="thanks__desc">
        직접 축하를 전하지 못하는 분들을 위해 부득이하게 계좌번호를 기재하게
        되었습니다. 넓은 마음으로 양해 부탁드립니다.
      </Typography>
      <div className="thanks__grid">
        <div>
          <AccountList
            title="신랑 측 계좌번호"
            items={appConfig.accounts.groomSide}
          />
        </div>
        <div>
          <AccountList
            title="신부 측 계좌번호"
            items={appConfig.accounts.brideSide}
          />
        </div>
      </div>
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

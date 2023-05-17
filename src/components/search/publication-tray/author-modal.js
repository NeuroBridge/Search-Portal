import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Slide,
} from "@mui/material";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Link } from "../../link";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line no-control-regex
const EMAIL_REGEX = /(?:(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))/g;

/**
 * parse some text with arbitrary emails into `ReactNode`s containing strings and `mailto:` links
 */
const parseEmails = (text) => {
  if(typeof text !== "string") return text;
  
  const emails = text.match(EMAIL_REGEX);
  if(emails === null) return text;
  
  return text.split(EMAIL_REGEX).reduce((acc, curr, i) => {
    acc.push(curr);

    const email = emails.shift()
    if(email)
      acc.push(<Link key={i} to={`mailto:${email}`}>{email}</Link>)

    return acc;
  }, [])
}

export const AuthorModal = ({ author, handleClose }) => {
  return (
    <Dialog
      open={Boolean(author)}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="author-dialog-description"
      sx={{
        '& a': { color: 'primary.main' },
      }}
    >
      <DialogTitle variant="h5">{`${author?.firstName} ${author?.lastName}`}</DialogTitle>
      <DialogContent id="author-dialog-description">
        {Array.isArray(author?.affiliations) && (
          <List>
            {author.affiliations.map((affiliation, i) => (
              <ListItem
                key={i}
                disableGutters
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-of-type": { border: "none" },
                }}
              >
                <ListItemText>{parseEmails(affiliation)}</ListItemText>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AuthorModal.propTypes = {
  author: PropTypes.shape({
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    initials: PropTypes.string,
    affiliations: PropTypes.array,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
};

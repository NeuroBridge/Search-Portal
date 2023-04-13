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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AuthorModal = ({ author, handleClose }) => {
  return (
    <Dialog
      open={Boolean(author)}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="author-dialog-description"
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
                <ListItemText>{affiliation}</ListItemText>
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

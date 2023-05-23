import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";

export default class Modal extends React.Component {
  /**
   * @param {string} props.title
   * @param {string} props.body
   * @param {string} props.cancelText
   * @param {string} props.confirmText
   * @param {boolean} props.cancelBtn
   */
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      cancelBtn: props.cancelBtn || false,
      cancelBtnText: props.cancelBtnText || "Cancel",
      confirmBtnText: props.confirmBtnText || "Confirm",
    };
  }

  handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  handleConfirm = () => {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  };

  render() {
    return (
      <Box>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>{this.props.title}</DialogTitle>
          <DialogContent>{this.props.body}</DialogContent>
          <DialogActions>
            {this.state.cancelBtn && (
              <Button
                onClick={this.handleClose}
                variant="contained"
                color="tertiary"
              >
                {this.state.cancelBtnText}
              </Button>
            )}
            <Button
              onClick={this.handleConfirm}
              variant="contained"
              color="primary"
            >
              {this.state.confirmBtnText}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

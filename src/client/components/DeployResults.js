import * as React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Typography,
} from "@mui/material";
import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export default class DeployResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: props.result || {},
    };
  }

  getFailures() {
    let failures = this.state.result.details.componentFailures;
    failures = Array.isArray(failures) ? failures : failures ? [failures] : [];
    return failures;
  }

  getSuccesses() {
    let successes = this.state.result.details.componentSuccesses;
    successes = Array.isArray(successes)
      ? successes
      : successes
      ? [successes]
      : [];
    successes = successes.filter((s) => {
      return s.fileName !== "package.xml";
    });
    return successes;
  }

  render() {
    return (
      <React.Fragment>
        {this.getFailures().length > 0 && (
          <React.Fragment>
            <Chip label="Failure" size="small" color="error" />
            <List>
              {this.getFailures().map((failure) => {
                return (
                  <React.Fragment key={failure.fullName}>
                    <ListItem>
                      <ListItemIcon>
                        <ErrorIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={failure.fullName}
                        secondary={
                          <Typography
                            variant="body2"
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2f2929",
                              fontFamily: "monospace",
                              padding: "0.5rem",
                            }}
                          >
                            {failure.lineNumber}:{failure.columnNumber}{" "}
                            {failure.problem}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                );
              })}
            </List>
          </React.Fragment>
        )}
        {this.getSuccesses().length > 0 && (
          <React.Fragment>
            <Chip label="Success" size="small" color="success" />
            <List>
              {this.getSuccesses().map((success) => {
                return (
                  <ListItem key={success.fullName}>
                    <ListItemIcon>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={success.fullName} />
                  </ListItem>
                );
              })}
            </List>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

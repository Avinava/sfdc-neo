import React from "react";
import {
  Container,
  Box,
  Grid,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Button,
  ButtonGroup,
  Paper,
  Tooltip,
  Typography,
  Icon,
} from "@mui/material";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { GrTest } from "react-icons/gr";
import { FaExclamationTriangle } from "react-icons/fa";

import { toast } from "react-toastify";
import AuthContext from "../components/AuthContext";
import APIService from "../services/APIService";
import Editor from "@monaco-editor/react";
import Modal from "../components/Modal";
import DeployResults from "../components/DeployResults";
import {
  PublishedWithChanges as PublishedWithChangesIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";

class EmailTemplateGenerator extends React.Component {
  static contextType = AuthContext;
  // should have two grids side by side
  state = {
    templates: [],
    selectedTemplateId: "",
    selectedTemplate: {},
    updatedTemplate: {},
    isResultLoading: false,
    loading: true,
    type: "code",
    metrics: {},
    openDeployResults: false,
    deployResultTile: "Validation Results",
  };
  apiService = new APIService({ context: this.context });

  componentDidMount() {
    this.getEmailTemplates();
  }

  onTemplateChange = (event) => {
    const emt = this.state.templates.find((r) => r.Id === event.target.value);
    if (emt.HtmlValue && emt.HtmlValue.length < 4000) {
      this.setState({
        selectedTemplateId: event.target.value,
        selectedTemplate: emt,
      });
    } else {
      this.setState({
        selectedTemplateId: "",
        selectedTemplate: {
          HtmlValue: "",
        },
      });
      toast.error(
        "This template is too large to be edited. Please select another template with less than 4000 characters."
      );
    }
  };

  getEmailTemplates() {
    this.apiService
      .getEmailTemplates()
      .then((response) => {
        console.log("response", response);
        this.setState({
          templates: response.filter((r) => r.HtmlValue),
          loading: false,
        });
      })
      .catch((err) => this.handleErrors(err));
  }

  generateEmailTemplate() {
    if (!this.validateselectedTemplate()) {
      return;
    }

    const emt = this.state.selectedTemplate;
    this.setState({ isResultLoading: true, type: "code", updatedTemplate: {} });
    this.apiService
      .generateEmailTemplate(emt)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  async deployTemplateConfirm() {
    this.setState({ openDeployConfirmation: true });
  }

  async saveTemplateBody() {}

  validateselectedTemplate() {
    if (!this.state.selectedTemplateId) {
      toast.error("Please select an Email Template first");
      return false;
    }
    return true;
  }

  handleResponse = (response) => {
    console.log("response", response);
    this.setState({
      updatedTemplate: {
        Body: response.result,
        HtmlValue: response.result,
      },
      isResultLoading: false,
    });
  };

  handleErrors(err) {
    this.setState({ isResultLoading: false, loading: false });
  }

  render() {
    return (
      <React.Fragment>
        <Container maxWidth="xl">
          <CircleSpinnerOverlay
            overlayColor="rgba(0,153,255,0.2)"
            message={
              <React.Fragment>
                <Typography variant="body1" sx={{ color: "white" }}>
                  Fetching apex templates...
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  This may take few seconds...
                </Typography>
              </React.Fragment>
            }
            loading={this.state.loading}
          />

          <CircleSpinnerOverlay
            overlayColor="rgba(0,153,255,0.2)"
            message={
              <React.Fragment>
                <Typography variant="body1" sx={{ color: "white" }}>
                  Processing your request...
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  This may take few seconds...
                </Typography>
              </React.Fragment>
            }
            loading={this.state.isResultLoading}
          />

          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <Paper sx={{ p: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="template-select">Email Template</InputLabel>
                    <Select
                      labelId="template-select"
                      id="template-select"
                      label="Email Template"
                      onChange={this.onTemplateChange}
                      value={this.state.selectedTemplateId}
                    >
                      {this.state.templates.map((emt, index) => (
                        <MenuItem value={emt.Id} key={index}>
                          {emt.Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
                <Box
                  sx={{
                    marginTop: "10px",
                  }}
                >
                  <Editor
                    height="calc(100vh - 215px)"
                    defaultLanguage="apex"
                    defaultValue="Get started by selecting an Email Template."
                    value={this.state.selectedTemplate?.HtmlValue}
                    disabled={true}
                    theme="vs-dark"
                    options={{
                      domReadOnly: true,
                      readOnly: true,
                      minimap: { enabled: false },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Grid container maxWidth="xl" minWidth="xl">
                  <Paper sx={{ p: "12px", width: "100%", textAlign: "center" }}>
                    <ButtonGroup variant="contained" size="small">
                      <Tooltip title="Beautify Email Template">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => this.generateEmailTemplate()}
                          startIcon={<GrTest />}
                          size="small"
                          disabled={
                            !this.state.selectedTemplate.HtmlValue ||
                            this.state.selectedTemplate.HtmlValue.length > 4000
                          }
                        >
                          Beautify Email Template
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                <Box
                  sx={{
                    marginTop: "11px",
                  }}
                >
                  <Editor
                    height="calc(100vh - 215px)"
                    defaultLanguage="apex"
                    defaultValue="Generated html template will appear here."
                    value={this.state.updatedTemplate.HtmlValue}
                    disabled={true}
                    theme="vs-dark"
                    options={{
                      domReadOnly: true,
                      readOnly: true,
                      minimap: { enabled: false },
                    }}
                  />
                  <Paper
                    sx={{
                      p: "12px",
                      mt: 1,
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <ButtonGroup
                      variant="contained"
                      size="small"
                      sx={{ textAlign: "center" }}
                    >
                      <Tooltip title="Save the email template">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => this.saveTemplateBody()}
                          size="small"
                          disabled={!this.state.updatedClass?.Body}
                          startIcon={<PublishedWithChangesIcon />}
                        >
                          Save Template
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
        {this.state.openDeployResults && (
          <Modal
            title={this.state.deployResultTile}
            body={<DeployResults result={this.state.deployResults} />}
            cancelBtn={false}
            onConfirm={() => this.setState({ openDeployResults: false })}
          ></Modal>
        )}

        {this.state.openDeployConfirmation && (
          <Modal
            title="Deploy Class"
            body={
              <React.Fragment>
                <Box sx={{ textAlign: "center" }}>
                  <Icon
                    component={FaExclamationTriangle}
                    sx={{ color: "orange", fontSize: 30, marginRight: 1 }}
                  />
                  <Typography variant="h6" component="div">
                    Warning
                  </Typography>
                  <Typography variant="body2">
                    Are you sure you want to override the email template with
                    the generated template?
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" component={Box}>
                    <ul>
                      <li>
                        This action will overwrite the html body of the selected
                        email template.
                      </li>
                      <li>
                        Please make sure you have a backup of the email template
                        before you proceed.
                      </li>
                      <li>This action cannot be undone.</li>
                    </ul>
                  </Typography>
                </Box>
              </React.Fragment>
            }
            cancelBtn={true}
            onConfirm={() => this.deployTemplate()}
            onClose={() => this.setState({ openDeployConfirmation: false })}
          ></Modal>
        )}
      </React.Fragment>
    );
  }
}

export default EmailTemplateGenerator;

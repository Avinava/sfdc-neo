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
} from "@mui/material";
import { MdEmail } from "react-icons/md";

import { toast } from "react-toastify";
import AuthContext from "../components/AuthContext";
import APIService from "../services/APIService";
import Editor from "@monaco-editor/react";
import { Interweave } from "interweave";
import LoadingOverlay from "../components/LoadingOverlay";

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
  };
  apiService = new APIService({ context: this.context });

  componentDidMount() {
    this.getEmailTemplates();
  }

  onTemplateChange = async (event) => {
    const emt = this.state.templates.find((r) => r.Id === event.target.value);
    const response = await this.validateTokenCount(emt);

    if (emt.HtmlValue && !response.limitExceeded) {
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
        `This template is too large. Please select another template with less than ${response.limit} tokens. Selected template has ${response.result} tokens.`
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

  validateTokenCount(em) {
    this.setState({ loading: true });
    return this.apiService
      .getTokenCount({
        Body: em.HtmlValue,
      })
      .then((response) => {
        if (response) {
          this.setState({ loading: false });
          return response;
        }
      })
      .catch((err) => this.handleErrors(err));
  }

  render() {
    return (
      <React.Fragment>
        <Container maxWidth="xl">
          <LoadingOverlay
            loading={this.state.loading}
            message="Fetching email templates"
          />

          <LoadingOverlay
            loading={this.state.isResultLoading}
            message="Processing your request..."
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
                    height="calc(50vh - 115px)"
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

                  <Box
                    sx={{
                      margin: "auto",
                      p: 2,
                      background: "#fff",
                      mt: 1,
                      minHeight: "calc(50vh - 107px)",
                      maxHeight: "calc(50vh - 107px)",
                      overflow: "auto",
                    }}
                  >
                    <Interweave
                      content={this.state.selectedTemplate?.HtmlValue}
                    />
                  </Box>
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
                          startIcon={<MdEmail />}
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
                    height="calc(50vh - 115px)"
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
                  <Box
                    sx={{
                      margin: "auto",
                      p: 2,
                      background: "#fff",
                      mt: 1,
                      minHeight: "calc(50vh - 107px)",
                      maxHeight: "calc(50vh - 107px)",
                      overflow: "auto",
                    }}
                  >
                    <Interweave
                      content={this.state.updatedTemplate?.HtmlValue}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}

export default EmailTemplateGenerator;

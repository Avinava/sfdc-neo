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
} from "@mui/material";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { MdEmail } from "react-icons/md";

import { toast } from "react-toastify";
import AuthContext from "../components/AuthContext";
import APIService from "../services/APIService";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

class FlowGenerator extends React.Component {
  static contextType = AuthContext;
  // should have two grids side by side
  state = {
    Flows: [],
    selectedFlowId: "",
    selectedFlow: {},
    updatedFlow: {},
    isResultLoading: false,
    loading: true,
    type: "code",
    metrics: {},
  };
  apiService = new APIService({ context: this.context });

  componentDidMount() {
    this.getFlows();
  }

  onFlowChange = (event) => {
    this.setState({
      loading: true,
    });
    const rule = this.state.Flows.find((r) => r.Id === event.target.value);

    this.apiService.getFlowDefinition(rule.ActiveVersionId).then((response) => {
      rule.Metadata = response.Metadata;
      this.setState({
        selectedFlowId: event.target.value,
        selectedFlow: rule,
        updatedFlow: response,
        loading: false,
      });
    });
  };

  getFlows() {
    this.apiService
      .getFlowDefinitions()
      .then((response) => {
        for (const rule of response) {
          rule.attributes = rule.attributes || {};
          rule.attributes.Name = rule.ActiveVersion.MasterLabel;
        }

        // sort by attributes.Name
        response.sort((a, b) => {
          if (a.attributes.Name < b.attributes.Name) {
            return -1;
          }
          if (a.attributes.Name > b.attributes.Name) {
            return 1;
          }
          return 0;
        });

        this.setState({
          Flows: response,
          loading: false,
        });
      })
      .catch((err) => this.handleErrors(err));
  }

  generateFlowDocumentation() {
    if (!this.validateselectedFlow()) {
      return;
    }

    const rule = this.state.selectedFlow;
    this.setState({
      isResultLoading: true,
      type: "doc",
      updatedFlow: {},
    });
    this.apiService
      .generateFlowDocumentation(rule)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  async deployFlowConfirm() {
    this.setState({ openDeployConfirmation: true });
  }

  async saveFlowBody() {}

  validateselectedFlow() {
    if (!this.state.selectedFlowId) {
      toast.error("Please select an Flow first");
      return false;
    }
    return true;
  }

  handleResponse = (response) => {
    console.log("response", response);
    this.setState({
      updatedFlow: {
        Body: response.result,
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
                  Fetching Flows...
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
                    <InputLabel id="Flow-select">Flow</InputLabel>
                    <Select
                      labelId="Flow-select"
                      id="Flow-select"
                      label=" Flow"
                      onChange={this.onFlowChange}
                      value={this.state.selectedFlowId}
                    >
                      {this.state.Flows.map((rule, index) => (
                        <MenuItem value={rule.Id} key={index}>
                          {rule.attributes.Name}
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
                    defaultValue="Get started by selecting an Flow."
                    value={this.state.selectedFlow?.Metadata}
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
                      <Tooltip title="Describe Flow">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => this.generateFlowDocumentation()}
                          startIcon={<MdEmail />}
                          size="small"
                          disabled={!this.state.selectedFlow?.Id}
                        >
                          Document Flow
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                <Box>
                  {this.state.type === "code" && (
                    <Box
                      sx={{
                        marginTop: "11px",
                      }}
                    >
                      <Editor
                        height="calc(100vh - 215px)"
                        defaultLanguage="apex"
                        defaultValue="Generated class will appear here."
                        value={this.state.updatedFlow.Body}
                        disabled={true}
                        theme="vs-dark"
                        options={{
                          domReadOnly: true,
                          readOnly: true,
                          minimap: { enabled: false },
                        }}
                      />
                    </Box>
                  )}
                  {this.state.type !== "code" && (
                    <Box
                      sx={{
                        marginTop: "13px",
                      }}
                    >
                      <article className="markdown-body">
                        <ReactMarkdown
                          children={this.state.updatedFlow?.Body}
                          remarkPlugins={[remarkGfm]}
                        />
                      </article>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}

export default FlowGenerator;

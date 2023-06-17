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
import { HiOutlineDocumentText } from "react-icons/hi";
import { GrTest } from "react-icons/gr";

import { toast } from "react-toastify";
import AuthContext from "../components/AuthContext";
import APIService from "../services/APIService";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Modal from "../components/Modal";
import DeployResults from "../components/DeployResults";
import {
  PublishedWithChanges as PublishedWithChangesIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import { FaExclamationTriangle } from "react-icons/fa";

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
    openDeployConfirmation: false,
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

  generateFlowTest() {
    if (!this.validateselectedFlow()) {
      return;
    }

    const rule = this.state.selectedFlow;
    this.setState({
      isResultLoading: true,
      type: "code",
      updatedFlow: {},
    });
    this.apiService
      .generateFlowTest(rule)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  async deployFlowConfirm() {
    this.setState({ openDeployConfirmation: true });
  }

  async validateClass() {
    if (!this.validateselectedFlow()) {
      return;
    }

    const cls = this.state.updatedFlow;
    cls.checkOnly = true;
    this.setState({
      isResultLoading: true,
      openDeployConfirmation: false,
      deployResultTile: "Deployment Results",
    });

    console.log("cls", cls);

    const deployRes = await this.apiService.deployClass(cls);
    if (deployRes.id) {
      this.pollStatus(deployRes.id);
    }
  }

  async deployClass() {
    if (!this.validateselectedFlow()) {
      return;
    }

    const cls = this.state.updatedFlow;
    this.setState({
      isResultLoading: true,
      openDeployConfirmation: false,
      deployResultTile: "Deployment Results",
    });
    const deployRes = await this.apiService.deployClass(cls);
    if (deployRes.id) {
      this.pollStatus(deployRes.id);
    }
  }

  async pollStatus(id) {
    const statusRes = await this.apiService.getDeployStatus(id);
    if (statusRes.done) {
      if (statusRes.success) {
        toast.success("Class successfully validated");
      } else {
        toast.error("Class validation failed");
      }
      this.setState({
        isResultLoading: false,
        type: "code",
        deployResults: statusRes,
        openDeployResults: true,
      });
    } else {
      setTimeout(() => {
        this.pollStatus(id);
      }, 5000);
    }
  }

  async deployClassConfirm() {
    this.setState({ openDeployConfirmation: true });
  }

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
                          startIcon={<HiOutlineDocumentText />}
                          size="small"
                          disabled={!this.state.selectedFlow?.Id}
                        >
                          Document Flow
                        </Button>
                      </Tooltip>
                      <Tooltip title="Generate Flow Test">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => this.generateFlowTest()}
                          startIcon={<GrTest />}
                          size="small"
                          disabled={!this.state.selectedFlow?.Id}
                        >
                          Generate Flow Test
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
                          <Tooltip title="Validate the generated class against your org. This is equivalent to validating a changeset">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => this.validateClass()}
                              size="small"
                              disabled={!this.state.updatedFlow?.Body}
                              startIcon={<PublishedWithChangesIcon />}
                            >
                              Validate
                            </Button>
                          </Tooltip>
                          <Tooltip title="Deploys the generated class to your org. This is equivalent to deploying a changeset">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => this.deployClassConfirm()}
                              size="small"
                              disabled={!this.state.updatedFlow?.Body}
                              startIcon={<PublishIcon />}
                            >
                              Deploy to Org
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </Paper>
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
                    Are you sure you want to deploy the generated class to your
                    org?
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" component={Box}>
                    <ul>
                      <li>
                        This action will overwrite any existing class with the{" "}
                        <b>same name</b>.
                      </li>
                      <li>
                        Please make sure there is no class with the{" "}
                        <b>same name</b> in your org before proceeding.
                      </li>
                      <li>This action cannot be undone.</li>
                    </ul>
                  </Typography>
                </Box>
              </React.Fragment>
            }
            cancelBtn={true}
            onConfirm={() => this.deployClass()}
            onClose={() => this.setState({ openDeployConfirmation: false })}
          ></Modal>
        )}
      </React.Fragment>
    );
  }
}

export default FlowGenerator;

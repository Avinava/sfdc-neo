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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { HiOutlineDocumentText } from "react-icons/hi";
import { SiCodereview } from "react-icons/si";
import { BiCommentEdit } from "react-icons/bi";
import { GrTest } from "react-icons/gr";
import { FaExclamationTriangle } from "react-icons/fa";

import { toast } from "react-toastify";
import AuthContext from "../components/AuthContext";
import "github-markdown-css";
import APIService from "../services/APIService";
import Editor from "@monaco-editor/react";
import Modal from "../components/Modal";
import DeployResults from "../components/DeployResults";
import {
  PublishedWithChanges as PublishedWithChangesIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";

class Generator extends React.Component {
  static contextType = AuthContext;
  // should have two grids side by side
  state = {
    classes: [],
    selectedClassId: "",
    selectedClass: {},
    updatedClass: {},
    isResultLoading: false,
    loading: true,
    type: "code",
    metrics: {},
    openDeployResults: false,
    deployResultTile: "Validation Results",
  };
  apiService = new APIService({ context: this.context });
  componentDidMount() {
    this.getApexClasses();
  }

  onClassChange = (event) => {
    // find the class in the classes array
    // set the state of the selected class
    const cls = this.state.classes.find((r) => r.Id === event.target.value);
    this.setState({ selectedClassId: event.target.value, selectedClass: cls });
  };

  getApexClasses() {
    this.apiService
      .getApexClasses()
      .then((response) => {
        this.setState({ classes: response, loading: false });
      })
      .catch((err) => this.handleErrors(err));
  }

  generateTest() {
    if (!this.validateSelectedClass()) {
      return;
    }

    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true, type: "code" });
    this.apiService
      .generateTest(cls)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  generateCodeDocumentation() {
    if (!this.validateSelectedClass()) {
      return;
    }

    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true, type: "code" });
    this.apiService
      .generateCodeComments(cls)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  generateDocumentation() {
    if (!this.validateSelectedClass()) {
      return;
    }

    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true, type: "doc" });
    this.apiService
      .generateDocumentation(cls)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  generateCodeReview() {
    if (!this.validateSelectedClass()) {
      return;
    }

    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true, type: "doc" });
    this.apiService
      .generateCodeReview(cls)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  async deployClassConfirm() {
    this.setState({ openDeployConfirmation: true });
  }

  async deployClass() {
    if (!this.state.updatedClass.Body) {
      toast.error("Please generate test class first");
      return;
    }

    const cls = this.state.updatedClass;
    cls.checkOnly = false;
    this.setState({
      isResultLoading: true,
      type: "code",
      openDeployConfirmation: false,
      deployResultTile: "Deployment Results",
    });
    const deployRes = await this.apiService.deployClass(cls);
    if (deployRes.id) {
      this.pollStatus(deployRes.id);
    }
  }

  async validateClass() {
    if (!this.state.updatedClass.Body) {
      toast.error("Please generate test class first");
      return;
    }

    this.setState({
      isResultLoading: true,
      type: "code",
      deployResultTile: "Validation Results",
    });
    const cls = this.state.updatedClass;
    cls.checkOnly = true;
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

  validateSelectedClass() {
    if (!this.state.selectedClassId) {
      toast.error("Please select an apex class first");
      return false;
    }
    return true;
  }

  handleResponse = (response) => {
    this.setState({
      updatedClass: {
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
                  Fetching apex classes...
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
                    <InputLabel id="apex-select">Apex Class</InputLabel>
                    <Select
                      labelId="apex-select"
                      id="apex-select"
                      label="Apex Class"
                      onChange={this.onClassChange}
                      value={this.state.selectedClassId}
                    >
                      {this.state.classes.map((cls, index) => (
                        <MenuItem value={cls.Id} key={index}>
                          {cls.Name}
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
                    defaultValue="Get started by selecting an apex class."
                    value={this.state.selectedClass?.Body}
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
                      <Tooltip title="Generate Test Class">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => this.generateTest()}
                          startIcon={<GrTest />}
                          size="small"
                        >
                          Test Class
                        </Button>
                      </Tooltip>
                      <Tooltip title="Generate Code Comments">
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<BiCommentEdit />}
                          onClick={() => this.generateCodeDocumentation()}
                          size="small"
                        >
                          Code Comments
                        </Button>
                      </Tooltip>
                      <Tooltip title="Generate Documentation">
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<HiOutlineDocumentText />}
                          onClick={() => this.generateDocumentation()}
                          size="small"
                        >
                          Documentation
                        </Button>
                      </Tooltip>
                      <Tooltip title="Generate Code Review">
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<SiCodereview />}
                          onClick={() => this.generateCodeReview()}
                          size="small"
                        >
                          Code Review
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </Paper>
                </Grid>

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
                      value={this.state.updatedClass.Body}
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
                            disabled={!this.state.updatedClass?.Body}
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
                            disabled={!this.state.updatedClass?.Body}
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
                        children={this.state.updatedClass?.Body}
                        remarkPlugins={[remarkGfm]}
                      />
                    </article>
                  </Box>
                )}
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

export default Generator;

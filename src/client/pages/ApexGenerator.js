import React from "react";
import {
  Container,
  Box,
  Grid,
  FormControl,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  Button,
  ButtonGroup,
  Paper,
  Tooltip,
  Typography,
  Icon,
  TextField,
  IconButton,
} from "@mui/material";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { HiOutlineDocumentText } from "react-icons/hi";
import { SiCodereview } from "react-icons/si";
import { MdReviews, MdOutlineMoreVert, MdRefresh } from "react-icons/md";
import { BiCommentEdit, BiRightIndent, BiTestTube } from "react-icons/bi";
import { RiTestTubeFill } from "react-icons/ri";

import { FaExclamationTriangle } from "react-icons/fa";
import { AiOutlineBuild } from "react-icons/ai";

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
    openTestClassUserPromptInput: false,
    deployResultTile: "Validation Results",
    anchorEl: null,
  };
  apiService = new APIService({ context: this.context });
  componentDidMount() {
    this.getApexClasses();
  }

  onClassChange = async (event) => {
    // find the class in the classes array
    // set the state of the selected class
    const cls = this.state.classes.find((r) => r.Id === event.target.value);
    const response = await this.validateTokenCount(cls);

    if (cls.Body && !response.limitExceeded) {
      this.setState({
        selectedClassId: event.target.value,
        selectedClass: cls,
      });
    } else {
      this.setState({ selectedClassId: "", selectedClass: {} });
      toast.error(
        `This class is too large. Please select another class with less than ${response.limit} tokens. Selected class has ${response.result} tokens.`
      );
    }
  };

  async onRefreshClick() {
    await this.getApexClasses();
    // call onClassChange
    if (this.state.selectedClassId) {
      this.onClassChange({ target: { value: this.state.selectedClassId } });
    }
  }

  async getApexClasses() {
    this.setState({ loading: true });
    try {
      const response = await this.apiService.getApexClasses();
      this.setState({ classes: response, loading: false });
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  generateTestClassAdvanced() {
    if (!this.validateSelectedClass()) {
      return;
    }
    this.setState({
      openTestClassUserPromptInput: true,
    });
  }

  async generateTestClass() {
    if (!this.validateSelectedClass()) {
      return;
    }

    const cls = this.state.selectedClass;
    this.setState({
      isResultLoading: true,
      type: "code",
      updatedClass: {},
      openTestClassUserPromptInput: false,
    });

    try {
      const def = await this.getTestFactoryDefinition();
      cls.factoryDef = def?.factory;
    } catch (error) {
      console.log("error", error);
    }

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
    this.setState({ isResultLoading: true, type: "code", updatedClass: {} });
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
    this.setState({ isResultLoading: true, type: "doc", updatedClass: {} });
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
    this.setState({ isResultLoading: true, type: "doc", updatedClass: {} });
    this.apiService
      .generateCodeReview(cls)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  generateCodeReviewPMD() {
    if (!this.validateSelectedClass()) {
      return;
    }

    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true, type: "doc", updatedClass: {} });
    this.apiService
      .generateCodeReviewPMD(cls)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  generateCodeRefactor() {
    if (!this.validateSelectedClass()) {
      return;
    }

    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true, type: "code", updatedClass: {} });
    this.apiService
      .generateCodeRefactor(cls)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  async formatApex() {
    if (!this.validateSelectedClass()) {
      return;
    }

    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true, type: "code", updatedClass: {} });
    this.apiService
      .formatApex(cls)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  async deployClassConfirm() {
    this.setState({ openDeployConfirmation: true });
  }

  async getTestFactoryDefinition() {
    // check the local storage for the test factory definition
    // if it exists and is older than a 5 days, then fetch it again

    // if it does not exist, then fetch it
    // save it in the local storage
    const key = this.context.session.id + "-test-factory";
    let def = localStorage.getItem(key);
    if (def) {
      const defObj = JSON.parse(def);
      const now = new Date();
      const lastUpdated = new Date(defObj.lastUpdated);
      const diff = now.getTime() - lastUpdated.getTime();
      const days = diff / (1000 * 3600 * 24);
      if (days < 5) {
        return defObj;
      } else {
        localStorage.removeItem(key);
        def = null;
      }
    }

    if (!def) {
      let res = await this.apiService.getTestFactoryDefinition();
      def = {};
      def.lastUpdated = new Date();
      def.factory = res;
      localStorage.setItem(key, JSON.stringify(def));
    }

    return def;
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

  validateTokenCount(cls) {
    this.setState({ loading: true });
    return this.apiService
      .getTokenCount(cls)
      .then((response) => {
        if (response) {
          this.setState({ loading: false });
          return response;
        }
      })
      .catch((err) => this.handleErrors(err));
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

  handleMoreMenuClick(event) {
    this.setState({ menuOpen: true, anchorEl: event.currentTarget });
  }

  handleGeneratedEditorChange = (value, event) => {
    this.setState({
      updatedClass: {
        Body: value,
      },
    });
  };

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
            <Paper sx={{ p: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={11} md={11}>
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
                    </Grid>
                    <Grid item xs={12} sm={1} md={1}>
                      <Tooltip title="Refresh the apex class list">
                        <IconButton
                          aria-label="refresh"
                          size="small"
                          onClick={() => this.onRefreshClick()}
                        >
                          <MdRefresh size={25} />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={9} sx={{ textAlign: "right" }}>
                  <ButtonGroup variant="contained" size="small">
                    <Tooltip title="Generate a test class for the current Apex class. This uses metadata api along with OpenAI to generate contextually correct test classes">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => this.generateTestClass()}
                        startIcon={<RiTestTubeFill size={12} />}
                        size="small"
                      >
                        Test Class
                      </Button>
                    </Tooltip>
                    <Tooltip title="Generate Test Class by providing some context about what you want to test">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => this.generateTestClassAdvanced()}
                        startIcon={<BiTestTube size={12} />}
                        size="small"
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ display: "block" }}
                        >
                          Test Class
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontSize: "0.6em", display: "block" }}
                        >
                          <br />
                          prompt
                        </Typography>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Add comments to the current Apex class. Uses OpenAI to add comments to the Apex Code so that its easier to read and maintain">
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<BiCommentEdit size={12} />}
                        onClick={() => this.generateCodeDocumentation()}
                        size="small"
                      >
                        Comments
                      </Button>
                    </Tooltip>
                    <Tooltip title="Generate documentation for the current Apex class. Using automatically generate comprehensive documentation for the present Apex class and its associated methods.">
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<HiOutlineDocumentText size={12} />}
                        onClick={() => this.generateDocumentation()}
                        size="small"
                      >
                        Document
                      </Button>
                    </Tooltip>
                    <Tooltip title="Generate a code review for the current Apex class">
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SiCodereview size={12} />}
                        onClick={() => this.generateCodeReview()}
                        size="small"
                      >
                        Review
                      </Button>
                    </Tooltip>
                    <Tooltip title="Generate a code review for the current Apex class enhanced by PMD. This uses PMD scan results along with OpenAI to generate a comprehensive code review.">
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<MdReviews size={12} />}
                        onClick={() => this.generateCodeReviewPMD()}
                        size="small"
                      >
                        Review
                        <Typography
                          variant="subtitle2"
                          sx={{ fontSize: "0.6em", display: "block" }}
                        >
                          <br />
                          PMD
                        </Typography>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Refactor and optimize the current Apex class">
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AiOutlineBuild size={12} />}
                        onClick={() => this.generateCodeRefactor()}
                        size="small"
                      >
                        Refactor
                      </Button>
                    </Tooltip>
                    <Tooltip title="Format and indent the current Apex code using Prettier">
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<BiRightIndent size={12} />}
                        onClick={() => this.formatApex()}
                        size="small"
                      >
                        Format
                      </Button>
                    </Tooltip>
                    {/* <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<MdOutlineMoreVert size={12} />}
                      onClick={(event) => this.handleMoreMenuClick(event)}
                      size="small"
                    >
                      More
                    </Button>
                    <Menu
                      anchorEl={this.state.anchorEl}
                      open={this.state.menuOpen}
                      onClose={() => this.setState({ menuOpen: false })}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem
                        onClick={() => this.setState({ menuOpen: false })}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        onClick={() => this.setState({ menuOpen: false })}
                      >
                        My account
                      </MenuItem>
                      <MenuItem
                        onClick={() => this.setState({ menuOpen: false })}
                      >
                        Logout
                      </MenuItem>
                    </Menu> */}
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
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
                        minimap: { enabled: false },
                      }}
                      onChange={this.handleGeneratedEditorChange}
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
                        children={this.state.updatedClass?.Body}
                        remarkPlugins={[remarkGfm]}
                      />
                    </article>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Paper
              sx={{
                p: 1,
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
        </Container>
        {this.state.openDeployResults && (
          <Modal
            title={this.state.deployResultTile}
            body={<DeployResults result={this.state.deployResults} />}
            cancelBtn={false}
            onConfirm={() => this.setState({ openDeployResults: false })}
          ></Modal>
        )}

        {this.state.openTestClassUserPromptInput && (
          <Modal
            title="Generate Test Class"
            body={
              <React.Fragment>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2">
                    To create a comprehensive test class, please enter the
                    relevant context and specific scenarios that you want the
                    generated tests to cover.
                  </Typography>
                </Box>
                <Box>
                  <TextField
                    id="outlined-multiline-static"
                    label="Test Scenarios"
                    multiline
                    rows={4}
                    fullWidth
                    value={this.state.selectedClass.prompt}
                    onChange={(e) => {
                      this.state.selectedClass.prompt = e.target.value;
                      this.setState({
                        selectedClass: this.state.selectedClass,
                      });
                    }}
                  />
                </Box>
              </React.Fragment>
            }
            cancelBtn={true}
            onConfirm={() => this.generateTestClass()}
            onClose={() =>
              this.setState({ openTestClassUserPromptInput: false })
            }
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

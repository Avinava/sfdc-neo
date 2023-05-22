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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { HiOutlineDocumentText } from "react-icons/hi";
import { SiCodereview } from "react-icons/si";
import { BiCommentEdit } from "react-icons/bi";
import { GrTest } from "react-icons/gr";
import { toast } from "react-toastify";
import AuthContext from "../components/AuthContext";
import "github-markdown-css";
import APIService from "../services/APIService";
import Editor from "@monaco-editor/react";

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
                    height="calc(100vh - 200px)"
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
                  <Paper sx={{ p: 1, width: "100%" }}>
                    <ButtonGroup variant="contained" size="small">
                      <Tooltip title="Generate Test Class">
                        <Button
                          variant="secondary"
                          onClick={() => this.generateTest()}
                          startIcon={<GrTest />}
                          size="small"
                        >
                          Test Class
                        </Button>
                      </Tooltip>
                      <Tooltip title="Generate Code Comments">
                        <Button
                          variant="secondary"
                          startIcon={<BiCommentEdit />}
                          onClick={() => this.generateCodeDocumentation()}
                          size="small"
                        >
                          Code Comments
                        </Button>
                      </Tooltip>
                      <Tooltip title="Generate Documentation">
                        <Button
                          variant="secondary"
                          startIcon={<HiOutlineDocumentText />}
                          onClick={() => this.generateDocumentation()}
                          size="small"
                        >
                          Documentation
                        </Button>
                      </Tooltip>
                      <Tooltip title="Generate Code Review">
                        <Button
                          variant="secondary"
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

                {!this.state.isResultLoading && this.state.type === "code" && (
                  <Box
                    sx={{
                      marginTop: "11px",
                    }}
                  >
                    <Editor
                      height="calc(100vh - 200px)"
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
                  </Box>
                )}
                {!this.state.isResultLoading && this.state.type !== "code" && (
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
      </React.Fragment>
    );
  }
}

export default Generator;

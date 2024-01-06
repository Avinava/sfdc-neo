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
  Card,
  CardContent,
} from "@mui/material";
import { CircleSpinnerOverlay } from "react-spinner-overlay";

import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import { Publish as PublishIcon } from "@mui/icons-material";
import { BiTestTube } from "react-icons/bi";
import { FaExclamationTriangle } from "react-icons/fa";

import remarkGfm from "remark-gfm";
import AuthContext from "../components/AuthContext";
import APIService from "../services/APIService";
import Modal from "../components/Modal";

const LabelValuePair = ({ label, value }) => (
  <Grid item xs={12}>
    <Typography variant="body2" component="span" style={{ fontWeight: "bold" }}>
      {label}:
    </Typography>{" "}
    <Typography variant="body2" component="span">
      {value}
    </Typography>
  </Grid>
);

class ValidationRuleGenerator extends React.Component {
  static contextType = AuthContext;
  // should have two grids side by side
  state = {
    ValidationRules: [],
    selectedValidationRuleId: "",
    selectedValidationRule: {},
    updatedValidationRule: {},
    isResultLoading: false,
    loading: true,
    type: "code",
    metrics: {},
    openDeployConfirmation: false,
  };
  apiService = new APIService({ context: this.context });

  componentDidMount() {
    this.getValidationRules();
  }

  onValidationRuleChange = (event) => {
    this.setState({
      loading: true,
    });
    const rule = this.state.ValidationRules.find(
      (r) => r.Id === event.target.value
    );

    this.apiService.getValidationRule(rule.Id).then((response) => {
      rule.Metadata = response.Metadata;
      this.setState({
        selectedValidationRuleId: event.target.value,
        selectedValidationRule: rule,
        updatedValidationRule: response,
        loading: false,
      });
    });
  };

  getValidationRules() {
    this.apiService
      .getValidationRules()
      .then((response) => {
        for (const rule of response) {
          rule.attributes = rule.attributes || {};
          rule.attributes.Name =
            (rule.EntityDefinition?.MasterLabel || rule.EntityDefinitionId) +
            " - " +
            rule.ValidationName;
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
          ValidationRules: response,
          loading: false,
        });
      })
      .catch((err) => this.handleErrors(err));
  }

  generateValidationRule() {
    if (!this.validateselectedValidationRule()) {
      return;
    }

    const rule = this.state.selectedValidationRule;
    this.setState({
      isResultLoading: true,
      type: "code",
      updatedValidationRule: {},
    });
    this.apiService
      .generateValidationRuleReview(rule)
      .then((response) => this.handleResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  async deployValidationRuleConfirm() {
    this.setState({ openDeployConfirmation: true });
  }

  async saveValidationRuleBody() {}

  validateselectedValidationRule() {
    if (!this.state.selectedValidationRuleId) {
      toast.error("Please select an Email ValidationRule first");
      return false;
    }
    return true;
  }

  handleResponse = (response) => {
    const jsonPayload = this.extractJSON(response);
    this.setState({
      updatedValidationRule: {
        Description: response.result,
        GeneratedMetadata: jsonPayload,
      },
      isResultLoading: false,
    });
  };

  extractJSON = (response) => {
    const parts = response.result.split("### JSON");
    if (parts.length === 2) {
      response.result = parts[0].trim();
      const json = parts[1].trim().replace(/^```json|```$/g, "");
      try {
        return JSON.parse(json);
      } catch (error) {}
    }
    return {};
  };

  handleErrors(err) {
    this.setState({ isResultLoading: false, loading: false });
  }

  deployConfirm() {
    this.setState({ openDeployConfirmation: true });
  }

  async deployValidationRule() {
    this.setState({ openDeployConfirmation: false, isResultLoading: true });
    const rule = this.state.selectedValidationRule;
    const generatedMetadata =
      this.state.updatedValidationRule.GeneratedMetadata;
    this.apiService
      .toolingUpdate("ValidationRule", {
        Id: rule.Id,
        Metadata: {
          description: generatedMetadata.Description,
          errorMessage: generatedMetadata.ErrorMessage,
          active: rule.Active,
          errorConditionFormula: rule.Metadata.errorConditionFormula,
          fullName: generatedMetadata.Name,
          errorDisplayField: rule.Metadata.errorDisplayField,
        },
        FullName: generatedMetadata.ValidationName,
      })
      .then((response) => this.handleDeployResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  handleDeployResponse(response) {
    this.setState({ isResultLoading: false });
    if (response.success) {
      toast.success("Validation Rule deployed successfully");
    } else {
      toast.error("Validation Rule deployment failed");
    }
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
                  Fetching ValidationRules...
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
                    <InputLabel id="ValidationRule-select">
                      ValidationRule
                    </InputLabel>
                    <Select
                      labelId="ValidationRule-select"
                      id="ValidationRule-select"
                      label=" ValidationRule"
                      onChange={this.onValidationRuleChange}
                      value={this.state.selectedValidationRuleId}
                    >
                      {this.state.ValidationRules.map((rule, index) => (
                        <MenuItem value={rule.Id} key={index}>
                          {rule.EntityDefinition?.MasterLabel}
                          {" - "}
                          {rule.ValidationName}
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
                  <Card
                    sx={{
                      mt: 2,
                      backgroundColor: "#1e1e1e",
                      color: "#fff",
                      mb: 2,
                      minHeight: 300,
                    }}
                  >
                    <CardContent>
                      {this.state.selectedValidationRule?.ValidationName ? (
                        <>
                          <Typography variant="body2" sx={{ color: "#3794ff" }}>
                            <strong>Name</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {this.state.selectedValidationRule?.ValidationName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#3794ff" }}>
                            <strong>Description</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {this.state.selectedValidationRule?.Description}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#3794ff" }}>
                            <strong>Error Message</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {this.state.selectedValidationRule?.ErrorMessage}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", color: "#ffd700" }}
                        >
                          Select a validation rule from the dropdown to get
                          started.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                  <Editor
                    height="calc(100vh - 600px)"
                    defaultLanguage="apex"
                    defaultValue="Get started by selecting an ValidationRule."
                    value={
                      this.state.selectedValidationRule?.Metadata
                        ?.errorConditionFormula
                    }
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
                      <Tooltip title="Review Validation Rule">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => this.generateValidationRule()}
                          startIcon={<BiTestTube />}
                          size="small"
                          disabled={!this.state.selectedValidationRule?.Id}
                        >
                          Review Validation Rule
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                <Box
                  sx={{
                    marginTop: "13px",
                  }}
                >
                  <article className="markdown-body">
                    <ReactMarkdown
                      children={this.state.updatedValidationRule?.Description}
                      remarkPlugins={[remarkGfm]}
                    />
                  </article>
                </Box>
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
                <Tooltip title="Deploys the suggestions to your Salesforce org">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.deployConfirm()}
                    size="small"
                    disabled={
                      !this.state.updatedValidationRule?.GeneratedMetadata
                    }
                    startIcon={<PublishIcon />}
                  >
                    Save suggestions to Org
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Paper>
          </Box>
        </Container>

        {this.state.openDeployConfirmation && (
          <Modal
            title="Deploy Validation Rule"
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
                    Are you sure you want to deploy the the suggested validation
                    changes to your org ?
                  </Typography>
                  <Card sx={{ mt: 2 }}>
                    <CardContent>
                      <Grid container alignItems="flex-start" spacing={2}>
                        <LabelValuePair
                          label="Name"
                          value={
                            this.state.updatedValidationRule?.GeneratedMetadata
                              ?.Name
                          }
                        />
                        <LabelValuePair
                          label="Description"
                          value={
                            this.state.updatedValidationRule?.GeneratedMetadata
                              ?.Description
                          }
                        />
                        <LabelValuePair
                          label="Error Message"
                          value={
                            this.state.updatedValidationRule?.GeneratedMetadata
                              ?.ErrorMessage
                          }
                        />
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
                <Box>
                  <Typography variant="body2" component={Box}>
                    <ul>
                      <li>This action will update existing validation rule</li>
                      <li>This action cannot be undone.</li>
                    </ul>
                  </Typography>
                </Box>
              </React.Fragment>
            }
            cancelBtn={true}
            onConfirm={() => this.deployValidationRule()}
            onClose={() => this.setState({ openDeployConfirmation: false })}
          ></Modal>
        )}
      </React.Fragment>
    );
  }
}

export default ValidationRuleGenerator;

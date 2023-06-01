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
      .generateValidationRuleDesc(rule)
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
    console.log("response", response);
    this.setState({
      updatedValidationRule: {
        Description: response.result,
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
                  <Editor
                    height="calc(100vh - 215px)"
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
                      <Tooltip title="Describe ValidationRule">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => this.generateValidationRule()}
                          startIcon={<MdEmail />}
                          size="small"
                          disabled={!this.state.selectedValidationRule?.Id}
                        >
                          Describe ValidationRule
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                <Box
                  sx={{
                    marginTop: "11px",
                    backgroundColor: "#f5f5f5",
                    minHeight: "calc(100vh - 215px)",
                    padding: "10px",
                  }}
                >
                  {this.state.updatedValidationRule?.Description}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}

export default ValidationRuleGenerator;

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
} from "@mui/material";
import axios from "axios";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CircleSpinnerOverlay,
  FerrisWheelSpinner,
} from "react-spinner-overlay";

class Generator extends React.Component {
  // should have two grids side by side
  state = {
    classes: [],
    selectedClassId: "",
    selectedClass: {},
    updatedClass: {},
    isResultLoading: false,
    loading: true,
  };
  componentDidMount() {
    this.getApexClasses();
  }

  onClassChange = (event) => {
    // find the class in the classes array
    // set the state of the selected class
    const cls = this.state.classes.find((r) => r.Id === event.target.value);
    console.log(cls);
    this.setState({ selectedClassId: event.target.value, selectedClass: cls });
  };

  getApexClasses() {
    axios
      .get("/api/v1/salesforce/apexclass")
      .then((response) => {
        console.log(response.data);
        this.setState({ classes: response.data, loading: false });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  generateTest() {
    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true });
    axios
      .post("/api/v1/generator/apexclass/test", cls)
      .then((response) => {
        this.setState({
          updatedClass: {
            Body: response.data.result,
          },
          isResultLoading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  generateDocumentation() {
    const cls = this.state.selectedClass;
    this.setState({ isResultLoading: true });
    axios
      .post("/api/v1/generator/apexclass/documentation", cls)
      .then((response) => {
        this.setState({
          updatedClass: {
            Body: response.data.result,
          },
          isResultLoading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  render() {
    return (
      <React.Fragment>
        <Container maxWidth="xl">
          <CircleSpinnerOverlay
            overlayColor="rgba(0,153,255,0.2)"
            message={
              <React.Fragment>
                <div>Fetching apex classes...</div>
                <div>This may take few seconds...</div>
              </React.Fragment>
            }
            loading={this.state.loading}
          />

          <CircleSpinnerOverlay
            overlayColor="rgba(0,153,255,0.2)"
            message={
              <React.Fragment>
                <div>Processing your request...</div>
                <div>This may take few seconds...</div>
              </React.Fragment>
            }
            loading={this.state.isResultLoading}
          />

          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
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
                <CodeEditor
                  value={this.state.selectedClass?.Body}
                  language="apex"
                  placeholder="Please select an Apex class."
                  onChange={(ev) => {}}
                  disabled={true}
                  padding={15}
                  style={{
                    fontSize: 12,
                    marginTop: 10,
                    maxHeight: "calc(100vh - 200px)",
                    overflow: "scroll",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Grid
                  container
                  maxWidth="xl"
                  minWidth="xl"
                  sx={{
                    paddingTop: "4px",
                  }}
                >
                  <ButtonGroup variant="contained">
                    <Button
                      variant="contained"
                      onClick={() => this.generateTest()}
                    >
                      Generate Test Class
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => this.generateDocumentation()}
                    >
                      Generate Documentation
                    </Button>
                  </ButtonGroup>
                </Grid>

                {this.state.isResultLoading && <Skeleton count={20} />}
                {!this.state.isResultLoading && (
                  <CodeEditor
                    value={this.state.updatedClass?.Body}
                    language="apex"
                    placeholder="Generated class will appear here."
                    onChange={(ev) => {}}
                    disabled={true}
                    padding={15}
                    style={{
                      fontSize: 12,
                      marginTop: 10,
                      maxHeight: "calc(100vh - 200px)",
                      overflow: "scroll",
                      fontFamily:
                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }}
                  />
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

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { toast } from "react-toastify";
import AuthContext from "../components/AuthContext";
import "github-markdown-css";
import APIService from "../services/APIService";
import Editor from "@monaco-editor/react";
import Modal from "../components/Modal";
import DeployResults from "../components/DeployResults";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  RefreshCw,
  TestTube,
  TestTubeDiagonal,
  MessageSquareCode,
  FileCode,
  ScanEye,
  FileCog,
  Paintbrush,
  CloudUpload,
  FileCheck2,
  TriangleAlert,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    message: {},
  };
  apiService = new APIService({ context: this.context });
  componentDidMount() {
    this.getApexClasses();
  }

  async getClassDetail(recordId) {
    return this.apiService.getRecordDetail(
      "ApexClass",
      recordId,
      ["Body"],
      true
    );
  }

  onClassChange = async (classId) => {
    // find the class in the classes array
    // set the state of the selected class
    this.setState({ loading: true });
    const cls = this.state.classes.find((r) => r.Id === classId);
    const detail = await this.getClassDetail(classId);
    cls.Body = detail.Body;
    const response = await this.validateTokenCount(cls);

    if (cls.Body && !response.limitExceeded) {
      this.setState({
        selectedClassId: classId,
        selectedClass: cls,
        loading: false,
      });
    } else {
      this.setState({ selectedClassId: "", selectedClass: {}, loading: false });
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

  validateIsTestClass() {
    const result =
      this.state.selectedClass?.Body &&
      this.state.selectedClass.Body.toLowerCase().includes("@istest");

    if (result) {
      toast.warn("This class is already a test class");
    }
    return result;
  }

  generateTestClassAdvanced() {
    if (!this.validateSelectedClass() || this.validateIsTestClass()) {
      return;
    }
    this.setState({
      openTestClassUserPromptInput: true,
    });
  }

  async generateTestClass() {
    if (!this.validateSelectedClass() || this.validateIsTestClass()) {
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
      this.setState({
        message: {
          title: "Searching for test factories",
          subtitle:
            "Searching for test factories in your org... This may take few seconds...",
        },
      });
      const def = await this.getTestFactoryDefinition();
      cls.factoryDef = def?.factory;
    } catch (error) {
      console.log("error", error);
    }

    this.setState({
      message: {
        title: "Generating test class",
        subtitle: "This may take few seconds... Can take upto 40 seconds",
      },
    });

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
      let res = {};
      try {
        res = await this.apiService.getTestFactoryDefinition(true);
      } catch (error) {
        console.log("failed to find test factory", error);
        toast.warn("Failed to find test factory in your org, using default");
      }
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
        Body:
          typeof response.result === "object" && response.result !== null
            ? response.result.Body
            : response.result,
      },
      isResultLoading: false,
      message: {
        title: "",
        subtitle: "",
      },
    });
  };

  handleErrors(err) {
    this.setState({
      isResultLoading: false,
      loading: false,
      message: {
        title: "",
        subtitle: "",
      },
    });
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
        <div className="flex justify-between items-center relative isolate overflow-hidden bg-slate-100 p-2 rounded-md border border-slate-200">
          <div className="flex items-center">
            <div className="relative min-w-72 bg-white">
              <Select onValueChange={this.onClassChange}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder="Select an Apex Class"
                    value={this.state.selectedClassId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {this.state.classes.map((cls, index) => (
                    <SelectItem value={cls.Id} key={index}>
                      {cls.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => this.onRefreshClick()}
              className="ml-1"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => this.generateTestClass()}
                    className="rounded-none rounded-l-lg border border-gray-600"
                  >
                    <TestTube className="mr-2 h-4 w-4" /> Test Class
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Generate a test class for the current Apex class. This uses
                  metadata api along with OpenAI to generate contextually
                  correct test classes
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => this.generateTestClassAdvanced()}
                    className="rounded-none border border-gray-600"
                  >
                    <TestTubeDiagonal className="mr-2 h-4 w-4 " /> Test Class
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Generate Test Class by providing some context about what you
                  want to test
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => this.generateCodeDocumentation()}
                    className="rounded-none border border-gray-600"
                  >
                    <MessageSquareCode className="mr-2 h-4 w-4" /> Comments
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Add comments to the current Apex class. Uses OpenAI to add
                  comments to the Apex Code so that its easier to read and
                  maintain
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => this.generateDocumentation()}
                    className="rounded-none border border-gray-600"
                  >
                    <FileCode className="mr-2 h-4 w-4" /> Document
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Generate documentation for the current Apex class. Using
                  automatically generate comprehensive documentation for the
                  present Apex class and its associated methods.
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => this.generateCodeReviewPMD()}
                    className="rounded-none border border-gray-600"
                  >
                    <ScanEye className="mr-2 h-4 w-4" /> Review
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Generate a code review for the current Apex class enhanced by
                  PMD. This uses PMD scan results along with OpenAI to generate
                  a comprehensive code review.
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => this.generateCodeRefactor()}
                    className="rounded-none border border-gray-600"
                  >
                    <FileCog className="mr-2 h-4 w-4" /> Refactor
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Refactor and optimize the current Apex class
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => this.formatApex()}
                    className="rounded-none rounded-r-lg border border-gray-600"
                  >
                    <Paintbrush className="mr-2 h-4 w-4" /> Format
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Format and indent the current Apex code using Prettier
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div>
          <LoadingOverlay
            loading={this.state.loading}
            message="Fetching apex classes"
          />

          <LoadingOverlay
            loading={this.state.isResultLoading}
            message={this.state.message.title || "Processing your request..."}
            subtitle={this.state.message.subtitle}
          />

          <div className="flex-grow">
            <div className="grid grid-cols-2">
              <div>
                <Editor
                  height="calc(100vh - 300px)"
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
              </div>
              <div>
                {this.state.type === "code" && (
                  <div>
                    <Editor
                      height="calc(100vh - 300px)"
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
                  </div>
                )}
                {this.state.type !== "code" && (
                  <div>
                    <article className="markdown-body">
                      <ReactMarkdown
                        children={this.state.updatedClass?.Body}
                        remarkPlugins={[remarkGfm]}
                      />
                    </article>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-2  bg-slate-100 p-2 rounded-md border border-slate-200">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => this.validateClass()}
                      className="rounded-none border border-gray-600 rounded-l-lg min-w-28"
                    >
                      <FileCheck2 className="mr-2 h-4 w-4" />
                      Validate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Validate the generated class against your org. This is
                    equivalent to validating a changeset
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => this.deployClassConfirm()}
                      className="rounded-none border border-gray-600 rounded-r-lg min-w-28"
                    >
                      <CloudUpload className="mr-2 h-4 w-4" />
                      Deploy
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Deploys the generated class to your org. This is equivalent
                    to deploying a changeset
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
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
                <div>
                  To create a comprehensive test class, please enter the
                  relevant context and specific scenarios that you want the
                  generated tests to cover.
                </div>
                <div>
                  {/* <TextField
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
                  /> */}
                  <Textarea
                    id="test-scenarios"
                    value={this.state.selectedClass.prompt}
                    onChange={(e) => {
                      this.state.selectedClass.prompt = e.target.value;
                      this.setState({
                        selectedClass: this.state.selectedClass,
                      });
                    }}
                  />
                </div>
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
                <div className="flex items-center justify-center">
                  <TriangleAlert className="h-6 w-6 text-orange-500" />
                  <div className="h-6 w-6 text-orange-500">Warning</div>
                  <p>
                    Are you sure you want to deploy the generated class to your
                    org?
                  </p>
                </div>
                <div>
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
                </div>
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

import {
  ApexLexer,
  CommonTokenStream,
  ApexParser,
  CaseInsensitiveInputStream,
} from "apex-parser";

class DeclarationTypeListener {
  createdNames = new Set();
  ignoredTypes = new Set(["map", "set", "list"]);

  constructor() {}

  enterCreatedName(ctx) {
    this.handleSObjects(ctx);
  }

  enterFormalParameterList(ctx) {
    this.handleSObjects(ctx);
  }

  enterTypeList(ctx) {
    this.handleSObjects(ctx);
  }

  enterTypeRef(ctx) {
    this.handleSObjects(ctx);
  }

  enterTypeName(ctx) {
    this.handleSObjects(ctx);
  }

  enterLocalVariableDeclarationStatement(ctx) {
    this.handleSObjects(ctx);
  }

  enterEnhancedForControl(ctx) {
    this.handleSObjects(ctx);
  }

  enterFromNameList(ctx) {
    this.handleSObjects(ctx);
  }

  enterEnhancedForControl(ctx) {
    this.handleSObjects(ctx);
  }

  handleSObjects(ctx) {
    const name = ctx.start.text.toLowerCase();
    if (!this.ignoredTypes.has(name)) {
      this.createdNames.add(name);
    }
  }
}

class CodeParser {
  /**
   *
   * @param {*} classBody apex class body
   * @returns list of sobjects / classes / interfaces / enums created in the class
   */
  parseDeclarationTypes(classBody) {
    const lexer = new ApexLexer(new CaseInsensitiveInputStream({}, classBody));
    const tokens = new CommonTokenStream(lexer);
    const parser = new ApexParser(tokens);

    lexer.removeErrorListeners();
    parser.removeErrorListeners();

    const listener = new DeclarationTypeListener();
    parser.addParseListener(listener);
    parser.compilationUnit();

    return listener.createdNames;
  }

  /**
   *
   * @param {*} classStr apex class body
   * @returns apex class name
   */
  parseClassName(classStr) {
    const stream = new CaseInsensitiveInputStream({}, classStr);
    const lexer = new ApexLexer(stream);
    const tokens = new CommonTokenStream(lexer);
    tokens.fill();
    // get the first Identifier token after class
    let foundClass = false;
    for (const token of tokens.tokens) {
      if (token.type === ApexLexer.CLASS) {
        foundClass = true;
      }
      if (foundClass && token.type === ApexLexer.Identifier) {
        return token.text;
      }
    }

    return;
  }
}

export default new CodeParser();

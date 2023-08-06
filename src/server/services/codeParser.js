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

class FieldReferenceListener extends DeclarationTypeListener {
  referencedFields = new Set();

  constructor() {
    super();
  }

  // Handle field references using dot notation
  enterAnyId(ctx) {
    if (
      ctx?.parent?.ruleContext?.DOT &&
      typeof ctx.parent.ruleContext.DOT === "function"
    ) {
      const fieldName = ctx.start.text.toLowerCase();
      this.referencedFields.add(fieldName);
    }
  }

  // Handle field references in SOQL queries
  enterSelectEntry(ctx) {
    this.referencedFields.add(ctx.start.text.toLowerCase());
  }

  enterId(ctx) {
    if (
      ctx.ruleContext.constructor.name === "IdContext" &&
      ctx.parent.ruleContext.constructor.name === "IdPrimaryContext"
    ) {
      this.referencedFields.add(ctx.start.text.toLowerCase());
    }
  }
}

class CodeParser {
  parseReferences(classBody) {
    const lexer = new ApexLexer(new CaseInsensitiveInputStream({}, classBody));
    const tokens = new CommonTokenStream(lexer);
    const parser = new ApexParser(tokens);

    lexer.removeErrorListeners();
    parser.removeErrorListeners();

    const listener = new FieldReferenceListener(); // Use the modified listener to handle field references.
    parser.addParseListener(listener);
    parser.compilationUnit();

    return listener.referencedFields;
  }

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

const getMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === "function"
  );
};

const getProperties = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] !== "function"
  );
};

export default new CodeParser();

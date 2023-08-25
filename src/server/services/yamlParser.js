import YAML from "json-to-pretty-yaml";

class YamlParser {
  // stringifies json to yaml
  // removes extra quotes from yaml
  stringify(json) {
    return YAML.stringify(json).replace(/"/g, "");
  }
}

export default new YamlParser();

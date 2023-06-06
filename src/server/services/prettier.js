import { format } from "prettier";
import * as apexPlugin from "prettier-plugin-apex";

class Prettier {
  formatApex(code) {
    return format(code, {
      parser: "apex",
      plugins: [apexPlugin],
      printWidth: 160,
    });
  }
}

export default new Prettier();

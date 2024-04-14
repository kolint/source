import { type Plugin } from "../plugin.js";

const let_: Plugin = {
  filter: (binding) => binding.name === "let",
  extend: ({ parent }) => parent.context.createChildContext(parent.rawValue()),
};

export default let_;

import { renderToString } from "react-dom/server";
import { createElement } from "react";
import ToolsGuide from "./src/pages/ToolsGuide";
import { MemoryRouter } from "react-router";

try {
  console.log("Rendering...");
  renderToString(createElement(MemoryRouter, null, createElement(ToolsGuide)));
  console.log("Success!");
} catch (e) {
  console.error("Error rendering:", e);
}

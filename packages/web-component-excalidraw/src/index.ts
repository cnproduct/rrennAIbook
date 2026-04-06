import r2wc from "@r2wc/react-to-web-component";
import { rrennAIbookExcalidraw } from "./rrennAIbookExcalidraw";
import "@excalidraw/excalidraw/index.css";

customElements.define(
  "rrennAIbook-excalidraw",
  r2wc(rrennAIbookExcalidraw, {
    props: {
      id: "string",
      lang: "string",
      autoZoom: "boolean",
      edit: "boolean",
      src: "string",
      onlinkopen: "function",
      onChange: "function",
      value: "object"
    },
  }),
);

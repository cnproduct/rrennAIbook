// Register directive nodes in mdast:
/// <reference types="mdast-util-directive" />
//
import { rrennAIbookContext } from "@rrennAIbook/types";
import { Root } from "mdast";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import {
  expectLeafDirective,
  isDirective,
  registerDirective,
} from "./remarkHelper";

export default (ctx: rrennAIbookContext) => () => {
  const name = "bookmarks";
  return (tree: Root, file: VFile) => {
    visit(tree, function (node) {
      if (isDirective(node)) {
        if (node.name !== name) return;

        const data = node.data || (node.data = {});

        expectLeafDirective(node, file, name);
        registerDirective(file, name, ["client.js"], ["style.css"], []);

        data.hName = "ul";
        data.hProperties = {
          class: "directive-bookmarks",
        };
        data.hChildren = [];
      }
    });
  };
};

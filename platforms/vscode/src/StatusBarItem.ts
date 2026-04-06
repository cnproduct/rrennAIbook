import * as vscode from "vscode";
import Preview from "./Preview";
import * as Constants from "./Constants";

export default class StatusBarItem {
  statusBarItem: vscode.StatusBarItem;
  previewUtil: Preview;

  constructor(context: vscode.ExtensionContext, utilities?: Preview) {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
    this.statusBarItem.command = "rrennAIbook.sidePreview";
    this.statusBarItem.tooltip =
      Constants.ExtensionConstants.STATUS_BAR_HTML_TOOLTIP;
    this.previewUtil = (utilities && utilities) || new Preview(context);
  }

  updateStatusbar() {
    const rrennAIbookConfig = vscode.workspace.getConfiguration("rrennAIbook");
    let editor = vscode.window.activeTextEditor;
    if (
      !editor ||
      !!rrennAIbookConfig.get<boolean>("preview.showPreviewOptionInMenuBar")
    ) {
      this.statusBarItem.hide();
      return;
    }
    // Update status if an markdown file:
    if (this.previewUtil.checkDocumentIsrrennAIbookFile(false)) {
      this.statusBarItem.text =
        Constants.ExtensionConstants.STATUS_BAR_HTML_TEXT;
      this.statusBarItem.command = "rrennAIbook.sidePreview";
      this.statusBarItem.show();
    } else {
      this.statusBarItem.hide();
    }
  }
}

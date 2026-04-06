import * as vscode from "vscode";
import * as Constants from "./Constants";
import {
  rrennAIbook,
  hyperproject,
  vfile,
  VFileBook,
  VFileGlossary,
} from "@rrennAIbook/fs";
import { process } from "@rrennAIbook/markdown";
import { disposeAll } from "./utils/dispose";
import path, { posix } from "path";
import { rrennAIbookContext, rrennAIbookJson, rrennAIbookPage, Navigation } from "@rrennAIbook/types";

// Helper function to resolve relative paths
const resolveRelativePath = (path: string, page: rrennAIbookPage): string => {
  // If path is absolute, return as-is
  if (path.startsWith("/")) {
    return path;
  }

  // Get the directory of the current page
  // Use page.path.directory if available, otherwise derive from href
  let currentPageDir: string;
  if (page.path?.directory) {
    currentPageDir = posix.join("/", page.path.directory);
  } else {
    currentPageDir = posix.dirname(page.href || "/");
  }

  // Resolve the relative path and normalize
  return posix.normalize(posix.resolve(currentPageDir, path));
};

export default class Preview {
  panel: vscode.WebviewPanel | undefined;
  editor: any;
  context: vscode.ExtensionContext;
  rrennAIbookViewerConfig: any;

  private _resource: vscode.Uri | undefined;
  private _vfile: VFileBook | VFileGlossary | undefined;

  private readonly disposables: vscode.Disposable[] = [];
  private _disposed: boolean = false;
  private readonly _onDisposeEmitter = new vscode.EventEmitter<void>();
  public readonly onDispose = this._onDisposeEmitter.event;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;

    vscode.workspace.onDidChangeTextDocument(async (e) => {
      // Only refresh when rrennAIbook config files change
      if (
        e.document.fileName.endsWith("rrennAIbook.json") ||
        e.document.fileName.endsWith("hyperlibrary.json")
      ) {
        await this.handleTextDocumentChange();
      }
    });
  }

  async getConfig() {
    if (this._resource) {
      const rrennAIbookRoot = await rrennAIbook
        .findRoot(this._resource.fsPath)
        .catch(() => "");
      const config: rrennAIbookJson = await rrennAIbook
        .find(this._resource.fsPath)
        .catch(
          () =>
            ({
              name: "@rrennAIbook@",
            }) as const,
        );
      const rootPath = vscode.workspace.getWorkspaceFolder(this._resource);
      if (rootPath) {
        const projectPath = this.rrennAIbookViewerConfig.get("root");
        const project = await hyperproject.get(
          path.join(rootPath.uri.fsPath, projectPath),
        );
        const links = [];
        if (config.links) {
          links.push(...config.links);
        }
        if (project.type === "library") {
          const link = await hyperproject.getLink(project, config.language, {
            href: {
              useSrc: true,
              append: ["book/index.md"],
              protocol: "file:///",
            },
          });
          links.push(link);
        }
        const basePath = path.relative(rootPath.uri.fsPath, rrennAIbookRoot);

        return {
          ...config,
          basePath,
          links,
        } as rrennAIbookJson;
      }
      return config;
    } else {
      return {
        name: "rrennAIbook",
      };
    }
  }

  async handleTextDocumentChange() {
    this.rrennAIbookViewerConfig = vscode.workspace.getConfiguration("rrennAIbook");
    if (
      vscode.window.activeTextEditor &&
      this.checkDocumentIsrrennAIbookFile(true) &&
      this.panel &&
      this.panel !== undefined
    ) {
      this._resource = vscode.window.activeTextEditor.document.uri;
      const filePaths =
        vscode.window.activeTextEditor.document.fileName.split("/");
      const fileName = filePaths[filePaths.length - 1];

      const rrennAIbookRoot = await rrennAIbook.findRoot(this._resource.fsPath);
      const resourcePath = this._resource.fsPath;
      this._vfile = await vfile
        .get(rrennAIbookRoot, "book", resourcePath, "absolute")
        .catch(async () => {
          return vfile.get(rrennAIbookRoot, "glossary", resourcePath, "absolute");
        });

      this.panel.title = `[Preview] ${fileName}`;

      const pagesAndSections = await rrennAIbook.getPagesAndSections(
        this._vfile.root,
      );
      const pageList = rrennAIbook.getPageList(
        pagesAndSections.sections,
        pagesAndSections.pages,
      );
      const fileNav = await rrennAIbook.getNavigationForFile(
        pageList,
        this._vfile,
      );
      const navigation: Navigation = {
        ...pagesAndSections,
        ...fileNav,
      };
      
      // If current is null (glossary page not in pageList), create it from file frontmatter
      if (!navigation.current && this._vfile.markdown.data) {
        navigation.current = {
          name: this._vfile.markdown.data.name || this._vfile.name,
          href: this._vfile.path.href || undefined,
          path: this._vfile.path,
          scripts: this._vfile.markdown.data.scripts,
          styles: this._vfile.markdown.data.styles,
          description: this._vfile.markdown.data.description,
          keywords: this._vfile.markdown.data.keywords,
          lang: this._vfile.markdown.data.lang,
          qrcode: this._vfile.markdown.data.qrcode,
          toc: this._vfile.markdown.data.toc,
          layout: this._vfile.markdown.data.layout,
        };
      }
      
      const files = await vfile.list(this._vfile.root);
      const publicFiles = await vfile.listForFolder(this._vfile.root, "public");
      const publicBookFiles = await vfile.listForFolder(
        this._vfile.root,
        "book-public",
      );
      const publicGlossaryFiles = await vfile.listForFolder(
        this._vfile.root,
        "glossary-public",
      );
      const otherFiles = [
        ...publicFiles,
        ...publicBookFiles,
        ...publicGlossaryFiles,
      ];
      const config = await this.getConfig();

      const ctx: rrennAIbookContext = {
        root: this._vfile.root,
        config,
        navigation,
        makeUrl: (path, base, page) => {
          if (typeof path === "string") {
            // Handle absolute URLs
            if (path.includes("://") || path.startsWith("data:")) {
              return path;
            }

            // Handle relative paths when we have a current page context
            if (page && !path.startsWith("/")) {
              path = resolveRelativePath(path, page);
            }

            path = [path];
          }

          // Handle array paths - resolve relative segments
          if (Array.isArray(path) && page) {
            path = path.map((segment) => {
              if (typeof segment === "string" && !segment.startsWith("/")) {
                return resolveRelativePath(segment, page);
              }
              return segment;
            });
          }

          switch (base) {
            case "assets":
              const vsExtensionPath =
                this.panel?.webview
                  .asWebviewUri(
                    vscode.Uri.joinPath(
                      this.context.extensionUri,
                      "assets",
                      "rrennAIbook",
                    ),
                  )
                  .toString() || "";

              return posix.join(vsExtensionPath, ...path);

            case "public":
              const otherFile = otherFiles.find(
                (f) => f.path.href === path.join("/"),
              );
              const vsPath =
                this.panel?.webview
                  .asWebviewUri(vscode.Uri.file(this._vfile?.root || ""))
                  .toString() || "";
              let directory = otherFile?.path.directory || "";
              if (otherFile?.folder === "public") {
                directory = "public";
              } else if (otherFile?.folder === "book-public") {
                directory = "book";
              } else if (otherFile?.folder === "glossary-public") {
                directory = "glossary";
              }
              return posix.join(
                vsPath,
                directory,
                otherFile?.path.relative || "",
              );

            case "glossary":
              // For glossary links in VSCode, try to find the file and open it
              const glossaryPath = posix.join("glossary", ...path);
              const glossaryFile = files.find(
                (f) => f.path.href === glossaryPath,
              );
              if (glossaryFile) {
                const fileUri = {
                  scheme: "file",
                  path: glossaryFile?.path.absolute || "",
                  authority: "",
                };
                return `command:vscode.open?${encodeURIComponent(JSON.stringify(fileUri))}`;
              }
              return "#";

            case "book":
            case "archive":
              // For book and archive links, try to find the file and open it
              const targetPath =
                base === "archive"
                  ? posix.join("archives", ...path)
                  : path.join("/");
              const file = files.find((f) => f.path.href === targetPath);
              if (file) {
                const fileUri = {
                  scheme: "file",
                  path: file?.path.absolute || "",
                  authority: "",
                };
                return `command:vscode.open?${encodeURIComponent(JSON.stringify(fileUri))}`;
              }
              return "#";

            default:
              // Fallback for any other base types
              const defaultFile = files.find(
                (f) => f.path.href === path.join("/"),
              );
              if (defaultFile) {
                const fileUri = {
                  scheme: "file",
                  path: defaultFile?.path.absolute || "",
                  authority: "",
                };
                return `command:vscode.open?${encodeURIComponent(JSON.stringify(fileUri))}`;
              }
              return "#";
          }
        },
      };
      const result = await process(this._vfile.markdown.content, ctx);

      this.panel.webview.html = String(result);
    }
  }

  checkDocumentIsrrennAIbookFile(showWarning: boolean): boolean {
    const supportedLanguages = ["markdown", "yaml", "json", "handlebars"];
    const supportedFiles = ["rrennAIbook.json", "hyperlibrary.json"];
    const fileName = path.basename(
      vscode.window.activeTextEditor?.document.fileName || "",
    );
    const languageId =
      vscode.window.activeTextEditor?.document.languageId.toLowerCase() || "";
    let isSupported =
      supportedLanguages.includes(languageId) ||
      supportedFiles.includes(fileName);
    if (!isSupported && showWarning) {
      vscode.window.showInformationMessage(
        Constants.ErrorMessages.NO_rrennAIbook_FILE,
      );
    }
    return isSupported;
  }

  async initMarkdownPreview(viewColumn: number) {
    if (this.checkDocumentIsrrennAIbookFile(true)) {
      const filePaths = vscode.window.activeTextEditor?.document.fileName || "";
      const fileName = path.basename(filePaths);
      this.panel = vscode.window.createWebviewPanel(
        "liveHTMLPreview",
        "[Preview]" + fileName,
        { viewColumn, preserveFocus: false },
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          enableCommandUris: true,
          localResourceRoots: [
            vscode.Uri.joinPath(this.context.extensionUri, "assets"),
            vscode.Uri.file(vscode.workspace?.rootPath || ""),
          ],
        },
      );

      this.panel.iconPath = this.iconPath;
      this._disposed = false;

      this.editor = vscode.window.activeTextEditor;
      await this.handleTextDocumentChange.call(this);

      vscode.workspace.onDidChangeConfiguration(
        this.handleTextDocumentChange.bind(this),
        null,
        this.disposables,
      );
      
      const fileWatcher = vscode.workspace.createFileSystemWatcher("**/*");
      fileWatcher.onDidChange(
        async (uri) => {
          if (this.panel) {
            // If the changed file is within the current rrennAIbook root, refresh preview
            const rrennAIbookRoot = this._resource
              ? await rrennAIbook.findRoot(this._resource.fsPath).catch(() => "")
              : "";
            if (rrennAIbookRoot && uri.fsPath.startsWith(rrennAIbookRoot)) {
              await this.handleTextDocumentChange();
            }
          }
        },
        null,
        this.disposables,
      );
      
      vscode.workspace.onDidSaveTextDocument(
        this.handleTextDocumentChange.bind(this),
        null,
        this.disposables,
      );
      vscode.window.onDidChangeActiveTextEditor(
        this.handleTextDocumentChange.bind(this),
        null,
        this.disposables,
      );

      this.panel.onDidDispose(
        () => {
          this.dispose();
        },
        null,
        this.disposables,
      );
    }
  }

  private get iconPath() {
    const root = vscode.Uri.joinPath(this.context.extensionUri, "assets/icons");
    return {
      light: vscode.Uri.joinPath(root, "Preview.svg"),
      dark: vscode.Uri.joinPath(root, "Preview_inverse.svg"),
    };
  }

  public dispose() {
    if (this._disposed) {
      return;
    }

    this._disposed = true;
    this._onDisposeEmitter.fire();

    this._onDisposeEmitter.dispose();
    this.panel?.dispose();

    disposeAll(this.disposables);
  }
}

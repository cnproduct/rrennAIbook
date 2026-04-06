/// <reference path="../rrennAIbook.types.js" />

/**
 * @type {rrennAIbookStruktolab}
 * @memberof rrennAIbook
 * @see rrennAIbook.store
 */
rrennAIbook.struktolab = (function () {
  const init = (root) => {
    let allStruktolabEditors = root.querySelectorAll("struktolab-editor");

    allStruktolabEditors.forEach((editor) => {
      const editorId = editor.getAttribute("data-id");

      // Load saved content for this editor
      rrennAIbook.store.db.struktolab.get(editorId).then((result) => {
        if (result) {
          editor.loadJSON(JSON.parse(result.tree));
        }
      });

      // Listen for changes in the editor
      editor.addEventListener("change", (e) => {
        rrennAIbook.store.db.struktolab.put({
          id: editorId,
          tree: JSON.stringify(e.detail.tree),
        });
      });
    });
  };

  // Initialize existing elements on document load
  document.addEventListener("DOMContentLoaded", () => {
    init(document);
  });

  // Observe for new tabs added to the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Element node
          init(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return {
    init,
  };
})();

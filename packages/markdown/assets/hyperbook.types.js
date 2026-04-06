/**
 * @file Type definitions for the rrennAIbook global namespace.
 * This file is NOT loaded in the browser. It exists solely for IDE support
 * and JSDoc cross-referencing between scripts.
 *
 * Usage: Add the following to the top of any script that references
 * other rrennAIbook modules:
 *   /// <reference path="../rrennAIbook.types.js" />
 */

/**
 * @namespace rrennAIbook
 * @description Global namespace for all rrennAIbook client-side modules.
 * Initialized by i18n.js (first script to load) with
 * `window.rrennAIbook = window.rrennAIbook || {}`.
 */

/**
 * @typedef {Object} rrennAIbookI18n
 * @property {(key: string, values?: Record<string, string>) => string} get
 *   Returns the translated string for the given key, substituting `{{placeholder}}`
 *   patterns with values from the `values` object. Falls back to the key itself
 *   if no translation is found.
 */

/**
 * @typedef {Object} rrennAIbookStore
 * @property {import("dexie").Dexie} db - The underlying Dexie database instance.
 * @property {() => Promise<void>} export - Export all store data as a JSON download.
 * @property {() => Promise<void>} reset - Clear all store data after user confirmation.
 * @property {() => Promise<void>} import - Import store data from a JSON file.
 */

/**
 * @typedef {Object} rrennAIbookCloud
 * @property {() => Promise<void>} save - Manually trigger a save to the cloud.
 * @property {() => Promise<void>} sendSnapshot - Send a full snapshot to the cloud.
 * @property {() => void} userToggle - Toggle the user login/info drawer.
 * @property {() => Promise<void>} login - Log in with username and password from the form.
 * @property {() => void} logout - Log out and clear auth state.
 */

/**
 * @typedef {Object} rrennAIbookAbc
 * @property {(root: HTMLElement) => void} init - Initialize ABC music elements.
 */

/**
 * @typedef {Object} rrennAIbookArchive
 * @property {() => void} init - Initialize archive download status indicators.
 */

/**
 * @typedef {Object} rrennAIbookAudio
 * @property {(id: string) => void} togglePlayPause - Toggle play/pause for an audio element.
 */

/**
 * @typedef {Object} rrennAIbookBookmarks
 * @property {(root?: Document) => void} update - Refresh the bookmarks list in the DOM.
 */

/**
 * @typedef {Object} rrennAIbookDownload
 * @property {(root: HTMLElement) => void} init - Initialize download status indicators.
 */

/**
 * @typedef {Object} rrennAIbookExcalidraw
 */

/**
 * @typedef {Object} rrennAIbookGeogebra
 * @property {(root: HTMLElement) => void} init - Initialize GeoGebra applets.
 */

/**
 * @typedef {Object} rrennAIbookH5p
 * @property {(root: HTMLElement) => Promise<void>} init - Initialize H5P elements.
 * @property {(id: string) => void} save - Save H5P user data for an element.
 */

/**
 * @typedef {Object} rrennAIbookLearningmap
 * @property {(root: HTMLElement) => void} init - Initialize learning map elements.
 */

/**
 * @typedef {Object} rrennAIbookMermaid
 * @property {() => void} init - Initialize mermaid diagrams.
 */

/**
 * @typedef {Object} rrennAIbookOnlineide
 * @property {(el: HTMLElement) => void} openFullscreen - Open the online IDE in fullscreen.
 */

/**
 * @typedef {Object} rrennAIbookP5
 */

/**
 * @typedef {Object} rrennAIbookProtect
 * @property {(root: HTMLElement) => void} init - Initialize protected content elements.
 */

/**
 * @typedef {Object} rrennAIbookPython
 * @property {(root: HTMLElement) => void} init - Initialize Python IDE elements.
 */

/**
 * @typedef {Object} rrennAIbookScratchblock
 * @property {() => void} init - Render all scratch blocks on the page.
 */

/**
 * @typedef {Object} rrennAIbookSlideshow
 * @property {(id: string) => void} update - Update slideshow state from store.
 * @property {(id: string, steps: number) => void} moveBy - Move the slideshow by a number of steps.
 * @property {(id: string, index: number) => void} setActive - Set the active slide by index.
 * @property {(root: HTMLElement) => void} init - Initialize slideshows within a root element.
 */

/**
 * @typedef {Object} rrennAIbookSqlide
 * @property {(el: HTMLElement) => void} openFullscreen - Open the SQL IDE in fullscreen.
 */

/**
 * @typedef {Object} rrennAIbookTabs
 * @property {(tabsId: string, tabId: string) => void} selectTab - Select a tab by ID.
 * @property {(root: HTMLElement) => void} init - Initialize tab elements.
 */

/**
 * @typedef {Object} rrennAIbookTextinput
 * @property {(root: HTMLElement) => void} init - Initialize text input elements.
 */

/**
 * @typedef {Object} rrennAIbookWebide
 */

/**
 * Global rrennAIbook namespace available on `window.rrennAIbook`.
 *
 * @type {{
 *   i18n: rrennAIbookI18n,
 *   store: rrennAIbookStore,
 *   cloud?: rrennAIbookCloud,
 *   toggleLightbox: (el: HTMLElement) => void,
 *   toggleBookmark: (key: string, label: string) => void,
 *   navToggle: () => void,
 *   tocToggle: () => void,
 *   searchToggle: () => void,
 *   search: () => void,
 *   qrcodeOpen: () => void,
 *   qrcodeClose: () => void,
 *   shareOpen: () => void,
 *   shareClose: () => void,
 *   shareUpdatePreview: () => void,
 *   shareCopyUrl: () => void,
 *   init: (root: HTMLElement) => void,
 *   abc?: rrennAIbookAbc,
 *   archive?: rrennAIbookArchive,
 *   audio?: rrennAIbookAudio,
 *   bookmarks?: rrennAIbookBookmarks,
 *   download?: rrennAIbookDownload,
 *   excalidraw?: rrennAIbookExcalidraw,
 *   geogebra?: rrennAIbookGeogebra,
 *   h5p?: rrennAIbookH5p,
 *   learningmap?: rrennAIbookLearningmap,
 *   mermaid?: rrennAIbookMermaid,
 *   onlineide?: rrennAIbookOnlineide,
 *   p5?: rrennAIbookP5,
 *   protect?: rrennAIbookProtect,
 *   python?: rrennAIbookPython,
 *   scratchblock?: rrennAIbookScratchblock,
 *   slideshow?: rrennAIbookSlideshow,
 *   sqlide?: rrennAIbookSqlide,
 *   tabs?: rrennAIbookTabs,
 *   textinput?: rrennAIbookTextinput,
 *   webide?: rrennAIbookWebide,
 * }}
 */
var rrennAIbook;

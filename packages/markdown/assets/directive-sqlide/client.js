/// <reference path="../rrennAIbook.types.js" />

/**
 * SQL IDE integration.
 * @type {rrennAIbookSqlide}
 * @memberof rrennAIbook
 */
rrennAIbook.sqlide = (function () {
  /**
   * @param {HTMLElement} el
   */
  function openFullscreen(el) {
    const frameEl =
      el.parentElement.parentElement.getElementsByClassName("sql-online")[0];
    frameEl.requestFullscreen();
  }

  return {
    openFullscreen,
  };
})();

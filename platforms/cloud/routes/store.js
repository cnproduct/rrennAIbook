var express = require("express");
var db = require("../lib/db");
var middleware = require("../middleware/auth");

var router = express.Router();

// GET /api/store/:rrennAIbookId — fetch current state (snapshot + event replay)
router.get(
  "/:rrennAIbookId",
  middleware.authenticateToken,
  async function (req, res) {
    try {
      var rrennAIbookId = req.params.rrennAIbookId;
      var userId = req.user.id;

      var rrennAIbook = await db.getAsync(
        "SELECT id FROM rrennAIbooks WHERE slug = ?",
        [rrennAIbookId]
      );

      if (!rrennAIbook) {
        res.status(404).json({ error: "rrennAIbook not found" });
        return;
      }

      var state = await db.reconstructState(userId, rrennAIbook.id);

      if (!state) {
        res.status(404).json({ error: "No store data found" });
        return;
      }

      res.json({
        snapshot: state.data,
        lastEventId: state.lastEventId,
        updatedAt: state.updatedAt,
      });
    } catch (error) {
      console.error("Get store error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST /api/store/:rrennAIbookId/events — append event batch
router.post(
  "/:rrennAIbookId/events",
  middleware.authenticateToken,
  async function (req, res) {
    try {
      if (req.user.readonly) {
        res.status(403).json({ error: "Read-only access" });
        return;
      }

      var rrennAIbookId = req.params.rrennAIbookId;
      var userId = req.user.id;
      var events = req.body.events;
      var afterEventId = req.body.afterEventId;

      if (!Array.isArray(events) || events.length === 0) {
        res.status(400).json({ error: "Events array required" });
        return;
      }

      var rrennAIbook = await db.getAsync(
        "SELECT id FROM rrennAIbooks WHERE slug = ?",
        [rrennAIbookId]
      );

      if (!rrennAIbook) {
        res.status(404).json({ error: "rrennAIbook not found" });
        return;
      }

      // Validate afterEventId matches server's latest
      var currentLatest = await db.getLatestEventId(userId, rrennAIbook.id);
      var latestSnapshot = await db.getLatestSnapshot(userId, rrennAIbook.id);
      var serverLatest = Math.max(
        currentLatest,
        latestSnapshot ? latestSnapshot.last_event_id : 0
      );

      if (afterEventId !== null && afterEventId !== undefined && afterEventId !== serverLatest) {
        res.status(409).json({
          error: "Stale state — re-fetch required",
          serverLastEventId: serverLatest,
        });
        return;
      }

      var lastEventId = await db.appendEvents(userId, rrennAIbook.id, events);

      res.json({
        success: true,
        lastEventId: lastEventId,
      });
    } catch (error) {
      console.error("Append events error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST /api/store/:rrennAIbookId/snapshot — full-state overwrite
router.post(
  "/:rrennAIbookId/snapshot",
  middleware.authenticateToken,
  async function (req, res) {
    try {
      if (req.user.readonly) {
        res.status(403).json({ error: "Read-only access" });
        return;
      }

      var rrennAIbookId = req.params.rrennAIbookId;
      var userId = req.user.id;
      var data = req.body.data;

      if (!data) {
        res.status(400).json({ error: "Snapshot data required" });
        return;
      }

      var rrennAIbook = await db.getAsync(
        "SELECT id FROM rrennAIbooks WHERE slug = ?",
        [rrennAIbookId]
      );

      if (!rrennAIbook) {
        res.status(404).json({ error: "rrennAIbook not found" });
        return;
      }

      var snapshotId = await db.replaceWithSnapshot(
        userId,
        rrennAIbook.id,
        data
      );

      res.json({
        success: true,
        snapshotId: snapshotId,
        lastEventId: 0,
      });
    } catch (error) {
      console.error("Save snapshot error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;

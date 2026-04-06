var express = require("express");
var db = require("../lib/db");
var auth = require("../lib/auth");
var mail = require("../lib/mail");
var middleware = require("../middleware/auth");

var router = express.Router();

// Cookie-based auth middleware for views
function requireAuth(req, res, next) {
  var token = req.cookies.admin_token;
  if (!token) {
    res.redirect("/login");
    return;
  }

  var decoded = auth.verifyToken(token);
  if (!decoded || (decoded.role !== "admin" && decoded.role !== "teacher")) {
    res.clearCookie("admin_token");
    res.redirect("/login");
    return;
  }

  req.user = decoded;
  next();
}

// Load permissions for the current user and attach to req
async function loadPermissions(req, _res, next) {
  if (req.user.role === "admin") {
    req.permissions = null; // admin has all permissions
  } else {
    var perms = await db.getUserPermissions(req.user.id);
    var permSet = {};
    perms.forEach(function (p) { permSet[p.permission] = true; });
    req.permissions = permSet;
  }
  next();
}

function hasPerm(req, permission) {
  if (req.user.role === "admin") return true;
  return req.permissions && req.permissions[permission];
}

// GET /login
router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

// POST /login
router.post("/login", async function (req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
      res.render("login", {
        title: "Login",
        error: "Username and password required",
      });
      return;
    }

    var user = await db.getAsync(
      "SELECT id, username, password, role FROM users WHERE username = ?",
      [username]
    );

    if (!user || !auth.verifyPassword(password, user.password, user.role)) {
      res.render("login", {
        title: "Login",
        error: "Invalid credentials",
      });
      return;
    }

    if (user.role !== "admin" && user.role !== "teacher") {
      res.render("login", {
        title: "Login",
        error: "Access denied",
      });
      return;
    }

    var token = auth.generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", { title: "Login", error: "Server error" });
  }
});

// GET /logout
router.get("/logout", function (req, res) {
  res.clearCookie("admin_token");
  res.redirect("/login");
});

// GET /forgot-password
router.get("/forgot-password", function (req, res) {
  res.render("forgot-password", { title: "Forgot Password" });
});

// POST /forgot-password
router.post("/forgot-password", async function (req, res) {
  try {
    var email = req.body.email;
    if (!email) {
      res.render("forgot-password", { title: "Forgot Password", error: "Email required" });
      return;
    }

    var user = await db.getAsync(
      "SELECT id, email, role FROM users WHERE email = ? AND role IN ('admin', 'teacher')",
      [email]
    );

    // Always show success to prevent email enumeration
    if (!user) {
      res.render("forgot-password", { title: "Forgot Password", success: "If an account with that email exists, a reset link has been sent." });
      return;
    }

    var resetToken = auth.generateResetToken(user.id, user.email);
    var baseUrl = process.env.BASE_URL || (req.protocol + "://" + req.get("host"));
    var resetUrl = baseUrl + "/reset-password?token=" + resetToken;

    try {
      await mail.sendPasswordResetEmail(user.email, resetUrl);
    } catch (mailError) {
      console.error("Failed to send reset email:", mailError);
      res.render("forgot-password", { title: "Forgot Password", error: "Failed to send email. Please contact an administrator." });
      return;
    }

    res.render("forgot-password", { title: "Forgot Password", success: "If an account with that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.render("forgot-password", { title: "Forgot Password", error: "Server error" });
  }
});

// GET /reset-password?token=...
router.get("/reset-password", function (req, res) {
  var token = req.query.token;
  if (!token) {
    res.redirect("/login");
    return;
  }

  var decoded = auth.verifyResetToken(token);
  if (!decoded) {
    res.render("reset-password", { title: "Reset Password", error: "Invalid or expired reset link. Please request a new one.", expired: true });
    return;
  }

  res.render("reset-password", { title: "Reset Password", token: token });
});

// POST /reset-password
router.post("/reset-password", async function (req, res) {
  try {
    var token = req.body.token;
    var password = req.body.password;
    var confirmPassword = req.body.confirm_password;

    if (!token || !password) {
      res.render("reset-password", { title: "Reset Password", error: "All fields required", token: token });
      return;
    }

    if (password !== confirmPassword) {
      res.render("reset-password", { title: "Reset Password", error: "Passwords do not match", token: token });
      return;
    }

    var decoded = auth.verifyResetToken(token);
    if (!decoded) {
      res.render("reset-password", { title: "Reset Password", error: "Invalid or expired reset link. Please request a new one.", expired: true });
      return;
    }

    var hashed = auth.hashPassword(password);
    await db.runAsync("UPDATE users SET password = ? WHERE id = ?", [hashed, decoded.id]);

    res.render("login", { title: "Login", success: "Password has been reset. Please log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.render("reset-password", { title: "Reset Password", error: "Server error", token: req.body.token });
  }
});

// GET  — rrennAIbooks list
router.get("/", requireAuth, loadPermissions, async function (req, res) {
  try {
    var rrennAIbooks = await db.allAsync(
      "SELECT id, slug, name, url, description, created_at FROM rrennAIbooks ORDER BY name"
    );

    if (req.user.role === "teacher") {
      rrennAIbooks = rrennAIbooks.filter(function (hb) {
        return hasPerm(req, "rrennAIbook:" + hb.id + ":read");
      });
    }

    // Attach per-rrennAIbook permissions for template rendering
    rrennAIbooks.forEach(function (hb) {
      hb.canUpdate = hasPerm(req, "rrennAIbook:" + hb.id + ":update");
      hb.canDelete = hasPerm(req, "rrennAIbook:" + hb.id + ":delete");
    });

    res.render("rrennAIbooks", {
      title: "rrennAIbooks",
      rrennAIbooks: rrennAIbooks,
      username: req.user.username,
      isAdmin: req.user.role === "admin",
      canCreate: hasPerm(req, "rrennAIbooks:create"),
    });
  } catch (error) {
    console.error("List rrennAIbooks error:", error);
    res.render("error", { message: "Failed to load rrennAIbooks", error: error });
  }
});

// POST /rrennAIbooks — Create rrennAIbook
router.post("/rrennAIbooks", requireAuth, loadPermissions, async function (req, res) {
  try {
    if (!hasPerm(req, "rrennAIbooks:create")) {
      res.redirect("/?error=Permission+denied");
      return;
    }

    var slug = req.body.slug;
    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;

    if (!slug || !name) {
      res.redirect("/?error=Slug+and+name+required");
      return;
    }

    var result = await db.runAsync(
      "INSERT INTO rrennAIbooks (slug, name, url, description) VALUES (?, ?, ?, ?)",
      [slug, name, url || null, description || null]
    );

    // Auto-grant teacher full permissions on created rrennAIbook
    if (req.user.role === "teacher") {
      var hbId = result.lastID;
      var allPerms = [
        "rrennAIbook:" + hbId + ":read",
        "rrennAIbook:" + hbId + ":update",
        "rrennAIbook:" + hbId + ":delete",
        "rrennAIbook:" + hbId + ":groups:create",
        "rrennAIbook:" + hbId + ":groups:update",
        "rrennAIbook:" + hbId + ":groups:delete",
        "rrennAIbook:" + hbId + ":students:create",
        "rrennAIbook:" + hbId + ":students:update",
        "rrennAIbook:" + hbId + ":students:delete",
      ];
      for (var i = 0; i < allPerms.length; i++) {
        await db.addPermission(req.user.id, allPerms[i]);
      }
    }

    res.redirect("/");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      res.redirect("/?error=rrennAIbook+slug+already+exists");
      return;
    }
    console.error("Create rrennAIbook error:", error);
    res.redirect("/?error=Server+error");
  }
});

// POST /rrennAIbooks/:id/update — Update rrennAIbook
router.post("/rrennAIbooks/:id/update", requireAuth, loadPermissions, async function (req, res) {
  try {
    var id = req.params.id;
    if (!hasPerm(req, "rrennAIbook:" + id + ":update")) {
      res.redirect("/?error=Permission+denied");
      return;
    }

    var slug = req.body.slug;
    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;

    await db.runAsync(
      "UPDATE rrennAIbooks SET slug = ?, name = ?, url = ?, description = ? WHERE id = ?",
      [slug, name, url || null, description || null, id]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Update rrennAIbook error:", error);
    res.redirect("/?error=Server+error");
  }
});

// POST /rrennAIbooks/:id/delete — Delete rrennAIbook
router.post("/rrennAIbooks/:id/delete", requireAuth, loadPermissions, async function (req, res) {
  try {
    var id = req.params.id;
    if (!hasPerm(req, "rrennAIbook:" + id + ":delete")) {
      res.redirect("/?error=Permission+denied");
      return;
    }

    await db.runAsync("DELETE FROM rrennAIbooks WHERE id = ?", [id]);
    res.redirect("/");
  } catch (error) {
    console.error("Delete rrennAIbook error:", error);
    res.redirect("/?error=Server+error");
  }
});

// GET /rrennAIbook/:id — Groups list for a rrennAIbook
router.get("/rrennAIbook/:id", requireAuth, loadPermissions, async function (req, res) {
  try {
    var rrennAIbookId = req.params.id;

    if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":read")) {
      res.redirect("/");
      return;
    }

    var rrennAIbook = await db.getAsync(
      "SELECT id, slug, name, url, description FROM rrennAIbooks WHERE id = ?",
      [rrennAIbookId]
    );

    if (!rrennAIbook) {
      res.redirect("/");
      return;
    }

    var groups = await db.allAsync(
      "SELECT g.id, g.name, g.description, g.created_at, " +
        "(SELECT COUNT(*) FROM users u WHERE u.group_id = g.id) as student_count " +
        "FROM groups g WHERE g.rrennAIbook_id = ? ORDER BY g.name",
      [rrennAIbookId]
    );

    res.render("groups", {
      title: rrennAIbook.name + " — Groups",
      rrennAIbook: rrennAIbook,
      groups: groups,
      username: req.user.username,
      isAdmin: req.user.role === "admin",
      canCreateGroup: hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":groups:create"),
      canUpdateGroup: hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":groups:update"),
      canDeleteGroup: hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":groups:delete"),
    });
  } catch (error) {
    console.error("List groups error:", error);
    res.render("error", { message: "Failed to load groups", error: error });
  }
});

// POST /rrennAIbook/:id/groups — Create group
router.post("/rrennAIbook/:id/groups", requireAuth, loadPermissions, async function (req, res) {
  try {
    var rrennAIbookId = req.params.id;

    if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":groups:create")) {
      res.redirect("/rrennAIbook/" + rrennAIbookId + "?error=Permission+denied");
      return;
    }

    var name = req.body.name;
    var description = req.body.description;

    if (!name) {
      res.redirect("/rrennAIbook/" + rrennAIbookId + "?error=Name+required");
      return;
    }

    await db.runAsync(
      "INSERT INTO groups (rrennAIbook_id, name, description) VALUES (?, ?, ?)",
      [rrennAIbookId, name, description || null]
    );

    res.redirect("/rrennAIbook/" + rrennAIbookId);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      res.redirect(
        "/rrennAIbook/" +
          req.params.id +
          "?error=Group+name+already+exists"
      );
      return;
    }
    console.error("Create group error:", error);
    res.redirect("/rrennAIbook/" + req.params.id + "?error=Server+error");
  }
});

// POST /groups/:id/update — Update group
router.post("/groups/:id/update", requireAuth, loadPermissions, async function (req, res) {
  try {
    var id = req.params.id;
    var rrennAIbookId = req.body.rrennAIbook_id;

    if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":groups:update")) {
      res.redirect("/rrennAIbook/" + rrennAIbookId + "?error=Permission+denied");
      return;
    }

    var name = req.body.name;
    var description = req.body.description;

    await db.runAsync(
      "UPDATE groups SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );

    res.redirect("/rrennAIbook/" + rrennAIbookId);
  } catch (error) {
    console.error("Update group error:", error);
    res.redirect("/");
  }
});

// POST /groups/:id/delete — Delete group
router.post("/groups/:id/delete", requireAuth, loadPermissions, async function (req, res) {
  try {
    var id = req.params.id;
    var rrennAIbookId = req.body.rrennAIbook_id;

    if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":groups:delete")) {
      res.redirect("/rrennAIbook/" + rrennAIbookId + "?error=Permission+denied");
      return;
    }

    await db.runAsync("DELETE FROM groups WHERE id = ?", [id]);
    res.redirect("/rrennAIbook/" + rrennAIbookId);
  } catch (error) {
    console.error("Delete group error:", error);
    res.redirect("/");
  }
});

// GET /rrennAIbook/:rrennAIbookId/group/:groupId — Students list
router.get(
  "/rrennAIbook/:rrennAIbookId/group/:groupId",
  requireAuth,
  loadPermissions,
  async function (req, res) {
    try {
      var rrennAIbookId = req.params.rrennAIbookId;
      var groupId = req.params.groupId;

      if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":read")) {
        res.redirect("/");
        return;
      }

      var rrennAIbook = await db.getAsync(
        "SELECT id, slug, name, url FROM rrennAIbooks WHERE id = ?",
        [rrennAIbookId]
      );

      if (!rrennAIbook) {
        res.redirect("/");
        return;
      }

      var group = await db.getAsync(
        "SELECT id, name, description FROM groups WHERE id = ? AND rrennAIbook_id = ?",
        [groupId, rrennAIbookId]
      );

      if (!group) {
        res.redirect("/rrennAIbook/" + rrennAIbookId);
        return;
      }

      var students = await db.allAsync(
        "SELECT u.id, u.username, u.password, u.created_at " +
          "FROM users u " +
          "WHERE u.role = 'student' AND u.group_id = ? ORDER BY u.username",
        [groupId]
      );

      // Enrich with store_updated_at from event-sourcing tables
      for (var si = 0; si < students.length; si++) {
        students[si].store_updated_at = await db.getStoreUpdatedAt(students[si].id, rrennAIbookId);
      }

      res.render("students", {
        title: group.name + " — Students",
        rrennAIbook: rrennAIbook,
        group: group,
        students: students,
        username: req.user.username,
        isAdmin: req.user.role === "admin",
        canCreateStudent: hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":students:create"),
        canUpdateStudent: hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":students:update"),
        canDeleteStudent: hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":students:delete"),
      });
    } catch (error) {
      console.error("List students error:", error);
      res.render("error", { message: "Failed to load students", error: error });
    }
  }
);

// GET /rrennAIbook/:rrennAIbookId/group/:groupId/events — Event log for a group
router.get(
  "/rrennAIbook/:rrennAIbookId/group/:groupId/events",
  requireAuth,
  loadPermissions,
  async function (req, res) {
    try {
      var rrennAIbookId = req.params.rrennAIbookId;
      var groupId = req.params.groupId;

      if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":read")) {
        res.redirect("/");
        return;
      }

      var rrennAIbook = await db.getAsync(
        "SELECT id, slug, name, url FROM rrennAIbooks WHERE id = ?",
        [rrennAIbookId]
      );

      if (!rrennAIbook) {
        res.redirect("/");
        return;
      }

      var group = await db.getAsync(
        "SELECT id, name FROM groups WHERE id = ? AND rrennAIbook_id = ?",
        [groupId, rrennAIbookId]
      );

      if (!group) {
        res.redirect("/rrennAIbook/" + rrennAIbookId);
        return;
      }

      // Get students in this group
      var students = await db.allAsync(
        "SELECT id, username FROM users WHERE role = 'student' AND group_id = ? ORDER BY username",
        [groupId]
      );

      var studentIds = students.map(function (s) { return s.id; });
      var studentMap = {};
      students.forEach(function (s) { studentMap[s.id] = s.username; });

      var events = [];
      var snapshots = [];

      if (studentIds.length > 0) {
        var placeholders = studentIds.map(function () { return "?"; }).join(",");

        // Get recent events (last 200)
        events = await db.allAsync(
          "SELECT e.id, e.user_id, e.table_name, e.operation, e.prim_key, e.created_at " +
            "FROM events e " +
            "WHERE e.user_id IN (" + placeholders + ") AND e.rrennAIbook_id = ? " +
            "ORDER BY e.id DESC LIMIT 200",
          studentIds.concat([rrennAIbookId])
        );

        // Add username to events
        events.forEach(function (e) {
          e.username = studentMap[e.user_id] || "Unknown";
        });

        // Get latest snapshot per student
        for (var i = 0; i < studentIds.length; i++) {
          var snap = await db.getLatestSnapshot(studentIds[i], rrennAIbookId);
          if (snap) {
            snap.username = studentMap[studentIds[i]];
            snap.user_id = studentIds[i];
            snapshots.push(snap);
          }
        }
      }

      res.render("event-log", {
        title: group.name + " — Event Log",
        rrennAIbook: rrennAIbook,
        group: group,
        events: events,
        snapshots: snapshots,
        username: req.user.username,
        isAdmin: req.user.role === "admin",
      });
    } catch (error) {
      console.error("Event log error:", error);
      res.render("error", { message: "Failed to load event log", error: error });
    }
  }
);

// GET /rrennAIbook/:rrennAIbookId/group/:groupId/snapshot/:studentId — Download student snapshot
router.get(
  "/rrennAIbook/:rrennAIbookId/group/:groupId/snapshot/:studentId",
  requireAuth,
  loadPermissions,
  async function (req, res) {
    try {
      var rrennAIbookId = req.params.rrennAIbookId;
      var studentId = req.params.studentId;

      if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":read")) {
        res.status(403).json({ error: "Permission denied" });
        return;
      }

      var student = await db.getAsync(
        "SELECT id, username FROM users WHERE id = ? AND role = 'student'",
        [studentId]
      );

      if (!student) {
        res.status(404).json({ error: "Student not found" });
        return;
      }

      var state = await db.reconstructState(student.id, parseInt(rrennAIbookId, 10));

      if (!state) {
        res.status(404).json({ error: "No store data found for this student" });
        return;
      }

      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="snapshot-' + student.username + '.json"'
      );
      res.json(state.data);
    } catch (error) {
      console.error("Download snapshot error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST /students — Create student
router.post("/students", requireAuth, loadPermissions, async function (req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var groupId = req.body.group_id;
    var rrennAIbookId = req.body.rrennAIbook_id;

    if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":students:create")) {
      res.redirect("/rrennAIbook/" + rrennAIbookId + "/group/" + groupId + "?error=Permission+denied");
      return;
    }

    if (!username || !password) {
      res.redirect(
        "/rrennAIbook/" +
          rrennAIbookId +
          "/group/" +
          groupId +
          "?error=Username+and+password+required"
      );
      return;
    }

    await db.runAsync(
      "INSERT INTO users (username, password, role, group_id) VALUES (?, ?, 'student', ?)",
      [username, password, groupId]
    );

    res.redirect(
      "/rrennAIbook/" + rrennAIbookId + "/group/" + groupId
    );
  } catch (error) {
    var rrennAIbookId2 = req.body.rrennAIbook_id;
    var groupId2 = req.body.group_id;
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      res.redirect(
        "/rrennAIbook/" +
          rrennAIbookId2 +
          "/group/" +
          groupId2 +
          "?error=Username+already+exists"
      );
      return;
    }
    console.error("Create student error:", error);
    res.redirect(
      "/rrennAIbook/" +
        rrennAIbookId2 +
        "/group/" +
        groupId2 +
        "?error=Server+error"
    );
  }
});

// POST /students/bulk — Bulk create students
router.post("/students/bulk", requireAuth, loadPermissions, async function (req, res) {
  try {
    var csv = req.body.csv;
    var groupId = req.body.group_id;
    var rrennAIbookId = req.body.rrennAIbook_id;
    var backUrl =
      "/rrennAIbook/" + rrennAIbookId + "/group/" + groupId;

    if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":students:create")) {
      res.redirect(backUrl + "?error=Permission+denied");
      return;
    }

    if (!csv || typeof csv !== "string" || !csv.trim()) {
      res.redirect(backUrl + "?error=CSV+data+required");
      return;
    }

    var lines = csv.trim().split("\n");
    var created = 0;
    var failed = 0;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;
      var parts = line.split(",").map(function (s) {
        return s.trim();
      });
      var username = parts[0];
      var password = parts[1];
      if (username && password) {
        try {
          await db.runAsync(
            "INSERT INTO users (username, password, role, group_id) VALUES (?, ?, 'student', ?)",
            [username, password, groupId]
          );
          created++;
        } catch (e) {
          failed++;
        }
      }
    }

    res.redirect(
      backUrl + "?success=Created+" + created + "+students" +
        (failed > 0 ? ",+" + failed + "+failed" : "")
    );
  } catch (error) {
    console.error("Bulk create error:", error);
    res.redirect(
      "/rrennAIbook/" +
        req.body.rrennAIbook_id +
        "/group/" +
        req.body.group_id +
        "?error=Server+error"
    );
  }
});

// POST /students/generate — Generate students
router.post("/students/generate", requireAuth, loadPermissions, async function (req, res) {
  try {
    var count = parseInt(req.body.count, 10) || 10;
    var prefix = req.body.prefix || "student";
    var pwLen = parseInt(req.body.password_length, 10) || 8;
    var groupId = req.body.group_id;
    var rrennAIbookId = req.body.rrennAIbook_id;
    var backUrl =
      "/rrennAIbook/" + rrennAIbookId + "/group/" + groupId;

    if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":students:create")) {
      res.redirect(backUrl + "?error=Permission+denied");
      return;
    }

    var chars = "abcdefghjkmnpqrstuvwxyz23456789";
    var created = 0;
    var generatedStudents = [];

    for (var i = 1; i <= count; i++) {
      var num = i < 10 ? "0" + i : "" + i;
      var pw = "";
      for (var j = 0; j < pwLen; j++) {
        pw += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      var username = prefix + num;
      try {
        await db.runAsync(
          "INSERT INTO users (username, password, role, group_id) VALUES (?, ?, 'student', ?)",
          [username, pw, groupId]
        );
        generatedStudents.push({ username: username, password: pw });
        created++;
      } catch (e) {
        // skip duplicates
      }
    }

    if (generatedStudents.length > 0) {
      res.redirect(
        backUrl + "?success=Generated+" + created + "+students"
      );
    } else {
      res.redirect(backUrl + "?error=No+students+generated");
    }
  } catch (error) {
    console.error("Generate students error:", error);
    res.redirect(
      "/rrennAIbook/" +
        req.body.rrennAIbook_id +
        "/group/" +
        req.body.group_id +
        "?error=Server+error"
    );
  }
});

// POST /students/:id/password — Update student password
router.post(
  "/students/:id/password",
  requireAuth,
  loadPermissions,
  async function (req, res) {
    try {
      var id = req.params.id;
      var password = req.body.password;
      var rrennAIbookId = req.body.rrennAIbook_id;
      var groupId = req.body.group_id;

      if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":students:update")) {
        res.redirect("/rrennAIbook/" + rrennAIbookId + "/group/" + groupId + "?error=Permission+denied");
        return;
      }

      await db.runAsync(
        "UPDATE users SET password = ? WHERE id = ? AND role = 'student'",
        [password, id]
      );

      res.redirect(
        "/rrennAIbook/" + rrennAIbookId + "/group/" + groupId
      );
    } catch (error) {
      console.error("Update password error:", error);
      res.redirect("/");
    }
  }
);

// POST /students/:id/delete — Delete student
router.post("/students/:id/delete", requireAuth, loadPermissions, async function (req, res) {
  try {
    var id = req.params.id;
    var rrennAIbookId = req.body.rrennAIbook_id;
    var groupId = req.body.group_id;

    if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":students:delete")) {
      res.redirect("/rrennAIbook/" + rrennAIbookId + "/group/" + groupId + "?error=Permission+denied");
      return;
    }

    await db.runAsync("DELETE FROM users WHERE id = ? AND role = 'student'", [
      id,
    ]);

    res.redirect(
      "/rrennAIbook/" + rrennAIbookId + "/group/" + groupId
    );
  } catch (error) {
    console.error("Delete student error:", error);
    res.redirect("/");
  }
});

// GET /rrennAIbook/:rrennAIbookId/group/:groupId/print — Printable cards
router.get(
  "/rrennAIbook/:rrennAIbookId/group/:groupId/print",
  requireAuth,
  loadPermissions,
  async function (req, res) {
    try {
      var rrennAIbookId = req.params.rrennAIbookId;
      var groupId = req.params.groupId;

      if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":read")) {
        res.redirect("/");
        return;
      }

      var rrennAIbook = await db.getAsync(
        "SELECT id, name FROM rrennAIbooks WHERE id = ?",
        [rrennAIbookId]
      );

      var group = await db.getAsync(
        "SELECT id, name FROM groups WHERE id = ? AND rrennAIbook_id = ?",
        [groupId, rrennAIbookId]
      );

      if (!rrennAIbook || !group) {
        res.redirect("/");
        return;
      }

      var students = await db.allAsync(
        "SELECT username, password FROM users WHERE role = 'student' AND group_id = ? ORDER BY username",
        [groupId]
      );

      res.render("print", {
        title: group.name + " — Credentials",
        rrennAIbook: rrennAIbook,
        group: group,
        students: students,
        layout: false,
      });
    } catch (error) {
      console.error("Print cards error:", error);
      res.render("error", { message: "Failed to load students", error: error });
    }
  }
);

// POST /impersonate/:studentId — Impersonate a student
router.post(
  "/impersonate/:studentId",
  requireAuth,
  loadPermissions,
  async function (req, res) {
    try {
      var studentId = req.params.studentId;
      var rrennAIbookId = req.body.rrennAIbook_id;
      var groupId = req.body.group_id;
      var backUrl =
        "/rrennAIbook/" + rrennAIbookId + "/group/" + groupId;

      if (!hasPerm(req, "rrennAIbook:" + rrennAIbookId + ":read")) {
        res.redirect(backUrl + "?error=Permission+denied");
        return;
      }

      var student = await db.getAsync(
        "SELECT id, username, group_id FROM users WHERE id = ? AND role = 'student'",
        [studentId]
      );

      if (!student || !student.group_id) {
        res.redirect(backUrl + "?error=Student+not+found");
        return;
      }

      var groupInfo = await db.getAsync(
        "SELECT g.rrennAIbook_id, h.slug, h.name, h.url " +
          "FROM groups g " +
          "JOIN rrennAIbooks h ON g.rrennAIbook_id = h.id " +
          "WHERE g.id = ?",
        [student.group_id]
      );

      if (!groupInfo || !groupInfo.url) {
        res.redirect(
          backUrl +
            "?error=No+URL+configured+for+this+rrennAIbook"
        );
        return;
      }

      var token = auth.generateImpersonationToken(
        req.user.id,
        student.id,
        student.username
      );

      var url =
        groupInfo.url.replace(/\/$/, "") + "#impersonate=" + token;
      res.redirect(url);
    } catch (error) {
      console.error("Impersonate error:", error);
      res.redirect("/");
    }
  }
);

// ===== User (Teacher) Management — Admin only =====

// GET /users — List teachers
router.get("/users", requireAuth, async function (req, res) {
  if (req.user.role !== "admin") {
    res.redirect("/");
    return;
  }

  try {
    var users = await db.allAsync(
      "SELECT id, username, email, created_at FROM users WHERE role = 'teacher' ORDER BY username"
    );
    res.render("users", {
      title: "Users",
      users: users,
      username: req.user.username,
      isAdmin: true,
    });
  } catch (error) {
    console.error("List users error:", error);
    res.render("error", { message: "Failed to load users", error: error });
  }
});

// POST /users — Create teacher
router.post("/users", requireAuth, async function (req, res) {
  if (req.user.role !== "admin") {
    res.redirect("/");
    return;
  }

  try {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    if (!username || !password) {
      res.redirect("/users?error=Username+and+password+required");
      return;
    }

    var hashed = auth.hashPassword(password);
    await db.runAsync(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, 'teacher')",
      [username, hashed, email || null]
    );

    res.redirect("/users");
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      res.redirect("/users?error=Username+already+exists");
      return;
    }
    console.error("Create user error:", error);
    res.redirect("/users?error=Server+error");
  }
});

// POST /users/:id/update — Update teacher
router.post("/users/:id/update", requireAuth, async function (req, res) {
  if (req.user.role !== "admin") {
    res.redirect("/");
    return;
  }

  try {
    var id = req.params.id;
    var username = req.body.username;
    var email = req.body.email;

    await db.runAsync(
      "UPDATE users SET username = ?, email = ? WHERE id = ? AND role = 'teacher'",
      [username, email || null, id]
    );

    res.redirect("/users");
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      res.redirect("/users?error=Username+already+exists");
      return;
    }
    console.error("Update user error:", error);
    res.redirect("/users?error=Server+error");
  }
});

// POST /users/:id/password — Reset teacher password
router.post("/users/:id/password", requireAuth, async function (req, res) {
  if (req.user.role !== "admin") {
    res.redirect("/");
    return;
  }

  try {
    var id = req.params.id;
    var password = req.body.password;

    if (!password) {
      res.redirect("/users?error=Password+required");
      return;
    }

    var hashed = auth.hashPassword(password);
    await db.runAsync(
      "UPDATE users SET password = ? WHERE id = ? AND role = 'teacher'",
      [hashed, id]
    );

    res.redirect("/users");
  } catch (error) {
    console.error("Update user password error:", error);
    res.redirect("/users?error=Server+error");
  }
});

// POST /users/:id/delete — Delete teacher
router.post("/users/:id/delete", requireAuth, async function (req, res) {
  if (req.user.role !== "admin") {
    res.redirect("/");
    return;
  }

  try {
    var id = req.params.id;
    await db.runAsync("DELETE FROM users WHERE id = ? AND role = 'teacher'", [id]);
    res.redirect("/users");
  } catch (error) {
    console.error("Delete user error:", error);
    res.redirect("/users?error=Server+error");
  }
});

// GET /users/:id/permissions — Manage teacher permissions
router.get("/users/:id/permissions", requireAuth, async function (req, res) {
  if (req.user.role !== "admin") {
    res.redirect("/");
    return;
  }

  try {
    var userId = req.params.id;

    var user = await db.getAsync(
      "SELECT id, username, email FROM users WHERE id = ? AND role = 'teacher'",
      [userId]
    );

    if (!user) {
      res.redirect("/users");
      return;
    }

    var permissions = await db.getUserPermissions(userId);
    var rrennAIbooks = await db.allAsync(
      "SELECT id, name, slug FROM rrennAIbooks ORDER BY name"
    );

    // Build permission map for template
    var permSet = {};
    permissions.forEach(function (p) { permSet[p.permission] = true; });

    var rrennAIbookPerms = rrennAIbooks.map(function (hb) {
      return {
        id: hb.id,
        name: hb.name,
        slug: hb.slug,
        read: !!permSet["rrennAIbook:" + hb.id + ":read"],
        update: !!permSet["rrennAIbook:" + hb.id + ":update"],
        delete: !!permSet["rrennAIbook:" + hb.id + ":delete"],
        groupsCreate: !!permSet["rrennAIbook:" + hb.id + ":groups:create"],
        groupsUpdate: !!permSet["rrennAIbook:" + hb.id + ":groups:update"],
        groupsDelete: !!permSet["rrennAIbook:" + hb.id + ":groups:delete"],
        studentsCreate: !!permSet["rrennAIbook:" + hb.id + ":students:create"],
        studentsUpdate: !!permSet["rrennAIbook:" + hb.id + ":students:update"],
        studentsDelete: !!permSet["rrennAIbook:" + hb.id + ":students:delete"],
      };
    });

    res.render("user-permissions", {
      title: user.username + " — Permissions",
      user: user,
      canCreate: !!permSet["rrennAIbooks:create"],
      rrennAIbookPerms: rrennAIbookPerms,
      username: req.user.username,
      isAdmin: true,
    });
  } catch (error) {
    console.error("Load permissions error:", error);
    res.render("error", { message: "Failed to load permissions", error: error });
  }
});

// POST /users/:id/permissions — Update teacher permissions
router.post("/users/:id/permissions", requireAuth, async function (req, res) {
  if (req.user.role !== "admin") {
    res.redirect("/");
    return;
  }

  try {
    var userId = req.params.id;

    var user = await db.getAsync(
      "SELECT id FROM users WHERE id = ? AND role = 'teacher'",
      [userId]
    );

    if (!user) {
      res.redirect("/users");
      return;
    }

    // Remove all existing permissions for this user
    await db.runAsync("DELETE FROM permissions WHERE user_id = ?", [userId]);

    // Add rrennAIbooks:create if checked
    if (req.body["rrennAIbooks:create"]) {
      await db.addPermission(userId, "rrennAIbooks:create");
    }

    // Process per-rrennAIbook permissions
    var rrennAIbooks = await db.allAsync("SELECT id FROM rrennAIbooks");
    var permTypes = ["read", "update", "delete", "groups:create", "groups:update", "groups:delete", "students:create", "students:update", "students:delete"];

    for (var i = 0; i < rrennAIbooks.length; i++) {
      var hbId = rrennAIbooks[i].id;
      for (var j = 0; j < permTypes.length; j++) {
        var key = "rrennAIbook:" + hbId + ":" + permTypes[j];
        if (req.body[key]) {
          await db.addPermission(userId, key);
        }
      }
    }

    res.redirect("/users/" + userId + "/permissions?success=Permissions+updated");
  } catch (error) {
    console.error("Update permissions error:", error);
    res.redirect("/users/" + req.params.id + "/permissions?error=Server+error");
  }
});

module.exports = router;

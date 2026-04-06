/**
 * LACourt HTML Parser
 * Optimized Stages 0–12
 */

const fs = require("fs");

// ============================
// Stage 0 — Load HTML
// ============================

function loadHTML(path) {

  return fs.readFileSync(path, "utf8");

}

// ============================
// Stage 1 — Extract Case Info
// ============================

function parseCaseInfo(html) {

  return {

    case_number:
      extract(html, /CASE INFORMATION:\s+(\S+)/),

    title:
      extract(html, /Case Title:\s+(.*)/),

    courthouse:
      extract(html, /Filing Courthouse:\s+(.*)/),

    filing_date:
      normalizeDate(
        extract(html, /Filing Date:\s+(.*)/)
      ),

    case_type:
      extract(html, /Case Type:\s+(.*)/),

    status:
      extract(html, /Status:\s+(.*)/)

  };

}

// ============================
// Stage 2 — Parse Parties
// ============================

function parseParties(html) {

  const lines =
    extractBlock(
      html,
      "PARTY INFORMATION",
      "Documents Filed"
    );

  const parties = [];

  lines.split("\n").forEach(line => {

    if (line.includes("Plaintiff") ||
        line.includes("Defendant")) {

      parties.push({
        name: line.replace(
          /(Plaintiff|Defendant)/g,
          ""
        ).trim(),

        role:
          line.includes("Plaintiff")
            ? "Plaintiff"
            : "Defendant"

      });

    }

  });

  return parties;

}

// ============================
// Stage 3 — Parse Attorneys
// ============================

function parseAttorneys(html) {

  const lines =
    extractBlock(
      html,
      "PARTY INFORMATION",
      "Documents Filed"
    );

  const attorneys = [];

  lines.split("\n").forEach(line => {

    if (line.includes("Attorney")) {

      attorneys.push({

        name:
          line.replace(
            /Attorney.*/,
            ""
          ).trim(),

        role:
          line.includes("Plaintiff")
            ? "Plaintiff Counsel"
            : "Defense Counsel"

      });

    }

  });

  return attorneys;

}

// ============================
// Stage 4 — Parse Filings
// ============================

function parseFilings(html) {

  const block =
    extractBlock(
      html,
      "Documents Filed",
      "Proceedings Held"
    );

  const filings = [];

  block.split("\n").forEach(line => {

    if (!line.match(/^\d/)) return;

    const parts =
      line.split("Filed by");

    filings.push({

      date:
        normalizeDate(
          parts[0].substring(0, 10)
        ),

      description:
        parts[0]
          .substring(10)
          .trim(),

      filed_by:
        parts[1]?.trim(),

      type:
        classifyType(line),

      tags:
        autoTag(line)

    });

  });

  return filings;

}

// ============================
// Stage 5 — Parse Hearings
// ============================

function parseHearings(html) {

  const block =
    extractBlock(
      html,
      "Proceedings Held",
      "Register Of Actions"
    );

  const hearings = [];

  block.split("\n").forEach(line => {

    if (!line.match(/^\d/)) return;

    hearings.push({

      datetime:
        parseDateTime(line),

      department:
        extract(line, /Department\s+(\S+)/),

      hearing:
        extract(line,
          /Department\s+\S+\s+(.*?)\s{2}/),

      result:
        line.split("  ").pop(),

      status:
        classifyStatus(line)

    });

  });

  return hearings;

}

// ============================
// Stage 6 — Register Actions
// ============================

function parseRegister(html) {

  const block =
    extractBlock(
      html,
      "Register Of Actions",
      null
    );

  const actions = [];

  block.split("\n").forEach(line => {

    if (!line.match(/^\d/)) return;

    actions.push({

      date:
        normalizeDate(
          line.substring(0, 10)
        ),

      text:
        line.substring(10).trim(),

      tags:
        autoTag(line)

    });

  });

  return actions;

}

// ============================
// Stage 7 — Events
// ============================

function deriveEvents(model) {

  model.events =
    model.filings
      .filter(f =>
        f.tags.includes("settlement") ||
        f.tags.includes("dismissal")
      )
      .map(f => ({

        date: f.date,
        event: f.description

      }));

}

// ============================
// Stage 8 — Indexes
// ============================

function buildIndexes(model) {

  model.indexes = {

    by_date: {},
    by_type: {},
    by_tag: {}

  };

  model.filings.forEach(f => {

    pushIndex(
      model.indexes.by_date,
      f.date,
      f
    );

    pushIndex(
      model.indexes.by_type,
      f.type,
      f
    );

    f.tags.forEach(tag =>
      pushIndex(
        model.indexes.by_tag,
        tag,
        f
      )
    );

  });

}

// ============================
// Stage 9 — Metrics
// ============================

function computeMetrics(model) {

  model.metrics = {

    total_filings:
      model.filings.length,

    total_hearings:
      model.hearings.length,

    vacated_hearings:
      model.hearings.filter(
        h =>
          h.result.includes("Vacated")
      ).length

  };

}

// ============================
// Stage 10–12 — Params
// ============================

function attachParams(model) {

  model.params = {

    timezone:
      "America/Los_Angeles",

    strict_schema: true,

    auto_tagging: true,

    sort_order: "ascending"

  };

}

// ============================
// UTILITIES
// ============================

function extract(text, regex) {

  const m = text.match(regex);

  return m ? m[1].trim() : null;

}

function extractBlock(
  text,
  start,
  end
) {

  const s =
    text.indexOf(start);

  const e =
    end
      ? text.indexOf(end, s)
      : text.length;

  return text.substring(s, e);

}

function normalizeDate(d) {

  const date =
    new Date(d);

  return isNaN(date)
    ? d
    : date.toISOString().split("T")[0];

}

function parseDateTime(line) {

  const dt =
    line.substring(0, 16);

  return new Date(dt)
    .toISOString();

}

function classifyType(text) {

  if (text.includes("Motion"))
    return "Motion";

  if (text.includes("Order"))
    return "Order";

  if (text.includes("Notice"))
    return "Notice";

  return "Other";

}

function classifyStatus(line) {

  if (line.includes("Vacated"))
    return "Vacated";

  if (line.includes("Held"))
    return "Held";

  return "Other";

}

function autoTag(text) {

  const tags = [];

  if (text.includes("Vacate"))
    tags.push("vacate");

  if (text.includes("Dismissal"))
    tags.push("dismissal");

  if (text.includes("Settlement"))
    tags.push("settlement");

  if (text.includes("Discovery"))
    tags.push("discovery");

  return tags;

}

function pushIndex(obj, key, val) {

  if (!obj[key])
    obj[key] = [];

  obj[key].push(val);

}

// ============================
// MAIN EXECUTION
// ============================

function run() {

  const html =
    loadHTML(
      "SoureView-LACourt.DocType.html"
    );

  const model = {};

  model.case =
    parseCaseInfo(html);

  model.parties =
    parseParties(html);

  model.attorneys =
    parseAttorneys(html);

  model.filings =
    parseFilings(html);

  model.hearings =
    parseHearings(html);

  model.register_actions =
    parseRegister(html);

  deriveEvents(model);

  buildIndexes(model);

  computeMetrics(model);

  attachParams(model);

  fs.writeFileSync(
    "lasc_optimized_model.json",
    JSON.stringify(model, null, 2)
  );

}

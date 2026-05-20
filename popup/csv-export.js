/**
 * CSV export logic for DS-Property-Percolator.
 *
 * This file is fork-specific — the upstream zeeschuimer project has no CSV
 * export. Keeping it separate from interface.js makes future upstream merges
 * cleaner: changes here do not affect the diff of interface.js.
 *
 * These functions are globals used by the .download-csv handler and button
 * creation in interface.js. They reference `background` (the background page
 * handle) and `iterate_items`, both defined in interface.js. Because all
 * function bodies are only invoked at runtime (on button click), the load
 * order between this file and interface.js does not matter for correctness.
 */

/**
 * Encode one CSV row per RFC 4180: quote fields containing commas, quotes, or newlines.
 *
 * @param {Array} values
 * @returns {string}
 */
function csv_row(values) {
  return values
    .map((v) => {
      const s = String(v ?? "");
      return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    })
    .join(",");
}

/**
 * Recursive helper for flatten_item.
 *
 * Walks a value found inside a plain object. Arrays at this depth are always
 * JSON-stringified (never index-expanded) to prevent media image arrays from
 * producing hundreds of columns.
 *
 * @param {string} prefix  Column name built so far
 * @param {*} val
 * @param {Object} result  Accumulator
 */
function flatten_nested(prefix, val, result) {
  if (val === null || val === undefined) {
    result[prefix] = "";
  } else if (Array.isArray(val)) {
    // Arrays inside a nested object are always kept as a JSON string.
    // Expanding them here would cause fields like Daft's media.images (28 images
    // × multiple sized URLs each) to generate hundreds of columns. Only top-level
    // arrays of objects are index-expanded — see flatten_item below.
    result[prefix] = val.length ? JSON.stringify(val) : "";
  } else if (typeof val === "object") {
    for (const [k, v] of Object.entries(val)) {
      flatten_nested(prefix + "_" + k, v, result);
    }
  } else if (typeof val === "string") {
    result[prefix] = background.strip_tags(val);
  } else {
    result[prefix] = val;
  }
}

/**
 * Flatten one stored item into a plain object suitable for CSV export.
 *
 * Metadata fields come first. Top-level fields from item.data are handled as:
 * - Plain objects → recursively flattened to `parent_child` columns
 * - Arrays of objects → index-expanded to `key_0_child`, `key_1_child`, …
 * - Arrays of scalars → JSON-stringified into a single column
 * - Strings → HTML-stripped
 * - Scalars → written as-is
 *
 * @param {Object} item  A stored item from the database
 * @returns {Object}
 */
function flatten_item(item) {
  const meta = {
    source_platform: item.source_platform ?? "",
    source_platform_url: background.normalize_url_encoding(
      item.source_platform_url ?? ""
    ),
    source_url: background.normalize_url_encoding(item.source_url ?? ""),
    timestamp_collected: item.timestamp_collected
      ? new Date(item.timestamp_collected).toISOString()
      : "",
    last_updated: item.last_updated
      ? new Date(item.last_updated).toISOString()
      : "",
  };

  const flat = {};
  for (const [key, val] of Object.entries(item.data || {})) {
    if (val === null || val === undefined) {
      flat[key] = "";
    } else if (Array.isArray(val)) {
      if (val.length && val[0] !== null && typeof val[0] === "object") {
        // Top-level array of objects: index-expand into numbered columns.
        // This turns CollegeCribs's bedrooms array into bedrooms_0_room_type,
        // bedrooms_0_price, bedrooms_1_room_type, etc., which is more useful
        // in a spreadsheet than a JSON blob. Each element is then passed to
        // flatten_nested, which handles any further nesting inside it.
        val.forEach((element, i) => {
          if (element && typeof element === "object") {
            for (const [k, v] of Object.entries(element)) {
              flatten_nested(key + "_" + i + "_" + k, v, flat);
            }
          } else {
            flat[key + "_" + i] = element ?? "";
          }
        });
      } else {
        // Top-level array of scalars (e.g. HostingPower transport: ["bus","train"],
        // Daft sections: ["Property","Residential","House"]). Kept as a JSON string
        // because there is no meaningful column name to assign to each element, and
        // the values are only useful read together.
        flat[key] = val.length ? JSON.stringify(val) : "";
      }
    } else if (typeof val === "object") {
      // Top-level plain object: recursively flatten into parent_child columns.
      // Examples: Daft seller → seller_name, seller_phone; ber → ber_rating, ber_epi;
      // MyHome Negotiator → Negotiator_Name, Negotiator_Phone. flatten_nested handles
      // the recursion and ensures any arrays encountered deeper (e.g. media.images)
      // are JSON-stringified rather than further expanded.
      for (const [k, v] of Object.entries(val)) {
        flatten_nested(key + "_" + k, v, flat);
      }
    } else if (typeof val === "string") {
      flat[key] = background.strip_tags(val);
    } else {
      flat[key] = val;
    }
  }

  return { ...meta, ...flat };
}

/**
 * Get a CSV dump of items for a platform.
 *
 * Produces a flat, normalised CSV with metadata columns first, followed by
 * all data fields discovered across the full item set. Columns are inferred
 * dynamically so modules that pass through API data with variable fields
 * (e.g. Daft, MyHome) are handled without a hardcoded schema.
 *
 * @param {string} platform
 * @returns {Promise<Blob>}
 */
async function get_csv_blob(platform) {
  const META_COLUMNS = [
    "source_platform",
    "source_platform_url",
    "source_url",
    "timestamp_collected",
    "last_updated",
  ];

  const flat_items = [];
  const data_columns = new Set();

  // Two-pass approach: collect all flattened items first, then write rows.
  // This is necessary because Daft and MyHome pass through raw API responses
  // with variable field sets — the complete column list is only known after
  // every item has been seen. Metadata columns are pinned to the front;
  // data columns appear in discovery order (first item wins for ordering).
  await iterate_items(platform, function (item) {
    const flat = flatten_item(item);
    flat_items.push(flat);
    for (const key of Object.keys(flat)) {
      if (!META_COLUMNS.includes(key)) {
        data_columns.add(key);
      }
    }
  });

  const headers = [...META_COLUMNS, ...data_columns];
  const rows = [csv_row(headers)];

  for (const flat of flat_items) {
    rows.push(csv_row(headers.map((h) => flat[h] ?? "")));
  }

  return new Blob([rows.join("\n")], { type: "text/csv" });
}

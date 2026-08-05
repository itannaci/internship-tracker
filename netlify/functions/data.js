// Netlify Function: GET/POST the Fieldbook app's data as one JSON blob,
// stored via Netlify Blobs. Reachable at /.netlify/functions/data,
// and aliased to /api/data by the redirect in netlify.toml.
const { getStore } = require("@netlify/blobs");

const EMPTY_DATA = { students: {}, logs: [], programInternships: [] };

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    // Same-origin by default since the frontend and function share a domain;
    // loosen this only if you need to call the API from a different origin.
  };

  try {
    // Netlify auto-injects blobs credentials for sites deployed via Git-based
    // continuous deployment. Manual/CLI deploys don't get that context, so we
    // fall back to explicit siteID + token (set BLOBS_SITE_ID / BLOBS_TOKEN in
    // the site's environment variables) if those are present.
    const storeOptions =
      process.env.BLOBS_SITE_ID && process.env.BLOBS_TOKEN
        ? { name: "fieldbook", siteID: process.env.BLOBS_SITE_ID, token: process.env.BLOBS_TOKEN }
        : "fieldbook";
    const store = getStore(storeOptions);

    if (event.httpMethod === "GET") {
      const data = (await store.get("data", { type: "json" })) || EMPTY_DATA;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (event.httpMethod === "POST") {
      let body;
      try {
        body = JSON.parse(event.body || "{}");
      } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
      }
      const toSave = {
        students: body.students || {},
        logs: body.logs || [],
        programInternships: body.programInternships || []
      };
      await store.setJSON("data", toSave);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || "Server error" }) };
  }
};

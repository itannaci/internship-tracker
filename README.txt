FIELDBOOK — NETLIFY DEPLOY PACKAGE (Netlify Functions + Netlify Blobs)
========================================================================

WHAT'S IN HERE
--------------
index.html                        The whole app UI.
netlify/functions/data.js         Serverless function that reads/writes
                                   your data using Netlify Blobs storage.
netlify.toml                      Site config: tells Netlify where the
                                   functions live and aliases
                                   /api/data -> /.netlify/functions/data.
package.json                      Declares the @netlify/blobs dependency
                                   the function needs.

NO FIREBASE, NO CONFIG KEYS TO PASTE IN
-----------------------------------------
Unlike the earlier version of this app, there's nothing to edit before
deploying. Netlify Blobs is built into your Netlify site automatically
once it's deployed — no account keys, no separate database to set up.

IMPORTANT: THIS ONE NEEDS A REAL DEPLOY, NOT DRAG-AND-DROP
-------------------------------------------------------------
Because the function depends on the @netlify/blobs npm package, Netlify
needs to install it before your site works. Plain drag-and-drop deploys
skip that install step, so use one of these two methods instead:

OPTION A — Netlify CLI (fastest, from your own computer)
------------------------------------------------------------
1. Make sure you have Node.js installed (nodejs.org).
2. Open a terminal in this folder and run:
     npm install
     npm install -g netlify-cli
     netlify login
     netlify deploy --prod
3. When prompted, choose "Create & configure a new site" (or link to an
   existing one), keep the publish directory as "." (current folder),
   and let it deploy. You'll get a live URL when it finishes.

OPTION B — Connect a GitHub repo (best for ongoing updates)
------------------------------------------------------------
1. Push this folder to a new GitHub repository.
2. In the Netlify dashboard, click "Add new site" → "Import an existing
   project" → connect GitHub → pick the repo.
3. Leave the build command blank and publish directory as "." — Netlify
   will run `npm install` automatically before deploying, which is all
   this project needs.
4. Every future push to the repo redeploys the site automatically.

CONNECT YOUR OWN DOMAIN
------------------------
1. In your site's Netlify dashboard, go to "Domain settings" → "Add a
   domain".
2. Enter your domain and follow Netlify's instructions to point your
   DNS at Netlify (either full nameservers or a CNAME/A record).
3. Netlify auto-provisions free HTTPS once DNS verifies — required
   here since browsers block geolocation access on non-HTTPS sites.

HOW DATA SYNCS
----------------
The app polls /api/data every ~8 seconds, so a student clocking in on
one device shows up for the admin (and other students) within a few
seconds elsewhere. If you ever open this file somewhere /api/data
isn't reachable (like testing it outside of Netlify), it automatically
falls back to a local preview mode so you can still click through it.

SECURITY REMINDER
-------------------
The admin passcode in index.html is a simple shared code, not real
authentication, and by default anyone who can reach /api/data can
read or write your data. Before using this with real student data,
consider:
  - Adding real login (e.g. Netlify Identity, or your school's SSO)
  - Restricting the function to authenticated requests only
  - Rotating the admin passcode and keeping it out of any public repo

Ask Claude if you'd like help adding authentication to the function.

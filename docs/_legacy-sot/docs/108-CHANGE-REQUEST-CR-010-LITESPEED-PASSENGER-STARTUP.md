# CR-010 — LiteSpeed Passenger startup compatibility

## Status

Approved by the product owner during shared-hosting deployment on 2026-08-09.

## Evidence

The API and database were healthy when started directly with Node.js 22.23.0,
while the public LiteSpeed endpoint returned HTTP 503. The Passenger error log
showed `ERR_REQUIRE_ASYNC_MODULE`: `/usr/local/lsws/fcgi-bin/lsnode.js` used
`require()` on the ESM `app.js`, whose imported server graph contains top-level
await.

## Decision

- Add `passenger.cjs` as the canonical CommonJS bridge.
- Keep the backend implementation as ESM/TypeScript.
- Cross the loader boundary with asynchronous `import('./src/server.ts')`.
- Keep `app.js` as a physical CommonJS dynamic-import bridge, covering
  LiteSpeed installations that keep requiring the default filename even when
  the UI shows a custom startup file.
- Declare the backend package root as CommonJS and preserve explicit ESM
  boundaries in `src/`, `scripts/`, and `tests/`.
- Gate the bridge through hosting preflight, release inventory, and a regression
  test that forbids synchronous `require()` of the server graph.

## Hosting action

Pull the approved API release, verify `app.js` is a regular file and the root
package type is `commonjs`, set the cPanel startup file to `app.js`, restart the
application, and require JSON HTTP 200 from `/api/v1/health` before
continuing frontend deployment.

## Production follow-up evidence

The first compatibility revision used `app.js -> passenger.cjs`. The hosting
filesystem preserved the symlink, but LiteSpeed still classified the requested
`app.js` path through the root ESM package scope and repeated
`ERR_REQUIRE_ASYNC_MODULE`. The approved follow-up therefore replaces the
symlink with a physical CommonJS `app.js` and nested ESM package boundaries.

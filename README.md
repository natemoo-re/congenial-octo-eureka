# Responsive layouts in shared components

Design Engineering Manager technical exercise. Candidate materials adapted from the supplied workspace and revised prompt. Samples use `@sentry/scraps`.

Run `npm start`, then open http://localhost:5173. The Node server serves the bundled pages with no install or build required. Use Node 24.2 or newer.

- `/` is the candidate workspace: prompt, both usages, width and content controls, neutral hierarchy, and notes with copy/save.
- `/regression` is the stage 3 reveal. Open it in a separate tab at minute 30. No link appears in the initial workspace.
- `candidate-workspace.html` is a self-contained fallback. Open it directly in a browser if the server is unavailable.
- `regression.html` is the self-contained stage 3 fallback. Keep it closed until the reveal.

The product schematic has a fixed 1440px viewport at 60% display scale. Pane widths are actual layout widths before scaling. The broken layout is intentional; the exercise does not prescribe a solution. Product action buttons are illustrations.

Notes live only in the page. Save or copy them before refreshing. Share the screen or use your normal collaborative document for joint annotation.

## Interview pacing

| Minutes | Discussion |
| --- | --- |
| 0–5 | Introduction; explain that sketches and pseudocode are sufficient. |
| 5–15 | User consequences, content, action importance, narrow-state behavior. |
| 15–30 | Ownership, responsive boundary, API. Consistently introduce the Resolve usage. |
| 30–40 | Open `/regression`; investigate the mechanism, possible fixes, and verification. |
| 40–52 | Pilot, ownership, automation, verification, stop conditions, and recovery. |
| 52–60 | Candidate questions, unscored. |

For rollout, supply the same constraints: two engineers and a designer for one iteration; a codemod skips complex layouts; one consuming team can review a small PR but cannot prioritize migration. Ask how to handle a team whose workflow worsens under the new behavior and cannot redesign this iteration. Finish with a one-minute recommendation.

Score Design & Problem Solving, Technical Judgment & Decision Making, and Communication & Collaboration independently using the existing Sentry six-point framework. Record independent proposals, clarifications, tradeoffs, supplied hints, reactions to new information, and missing evidence. Preserve leadership time at minute 40 and candidate questions at minute 52.

## Edit and check the workspace

The editable React source is in `src`. Run `npm run build` after editing it to typecheck and rebuild both standalone pages. The server reads the pages on each request, so refresh the browser after rebuilding. `npm run dev` restarts the Node server when its source changes.

Run `npm test` for server response checks and `npm run lint` for source linting. `PORT=3000 npm start` changes the local port. Only the candidate workspace and regression reveal are served; source files and this guide are unavailable through HTTP.

The build dependencies in `node_modules` link to packages already installed in `/Users/natemoore/Code/sentry`. Registry access was blocked in the agent sandbox. To rebuild elsewhere, run `npm install` with registry access. Serving the bundled pages needs only Node and does not depend on that checkout.

The standalone fallback includes the bundled Scraps components and needs no server or external dependencies.

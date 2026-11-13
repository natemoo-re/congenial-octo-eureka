import { useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { Button } from '@sentry/scraps/button'
import { lightTheme } from '@sentry/scraps/theme'

export default function Regression() {
  const [width, setWidth] = useState(560)

  return (
    <ThemeProvider theme={lightTheme}>
      <main className="regression-page">
        <p>Additional example · Responsive layouts in shared components</p>
        <h1>A regression during migration</h1>
        <p>A related row now grows from 36px to 40px when its actions appear on hover in a narrow container. It remains stable in the wide layout.</p>
        <p>How would you investigate this, and what would you change?</p>
        <div className="regression-controls">
          <Button aria-pressed={width === 560} onClick={() => setWidth(560)}>Narrow · 560px</Button>
          <Button aria-pressed={width === 960} onClick={() => setWidth(960)}>Wide · 960px</Button>
          <span>Container: {width}px</span>
        </div>
        <div className="regression-scroll">
          <div className={`regression-list ${width === 560 ? 'narrow' : 'wide'}`} style={{ width }}>
            <div className="regression-row interactive-row">
              <a href="#example-row" onClick={event => event.preventDefault()}>Unexpected application error</a>
              <div className="regression-actions">
                <Button size="sm" onClick={() => {}}>Copy link</Button>
                <Button size="sm" onClick={() => {}}>More ···</Button>
              </div>
            </div>
            <div className="regression-row">Another application event</div>
            <div className="regression-row">Following content</div>
          </div>
        </div>
        <p>Hover the first row, or use Tab to focus its link and actions. The buttons are illustrative.</p>
        <details>
          <summary>Text equivalent</summary>
          <p>In the narrow example, the row is 36px tall before hover. When actions appear, it becomes 40px tall, moving everything below it down 4px. Keyboard focus reveals the same actions. The wide row stays 40px tall.</p>
        </details>
        <p>This demonstration reproduces the symptom. Its source is not the historical implementation.</p>
      </main>
      <style>{`
        .regression-page {max-width:1100px;margin:48px auto;padding:0 24px;color:#2b2233;font:16px/1.6 system-ui}
        .regression-page h1 {font-size:32px;margin:16px 0}
        .regression-page p {margin:16px 0}
        .regression-controls {display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:28px 0 16px}
        .regression-scroll {overflow:auto;padding:4px 0 16px}
        .regression-list {border:1px solid #d6d0dc;border-radius:6px;overflow:hidden}
        .regression-row {box-sizing:border-box;min-height:36px;display:flex;gap:12px;align-items:center;padding:4px 12px;font-size:14px;line-height:20px;box-shadow:inset 0 -1px #e8e4eb}
        .interactive-row {background:#f5f1ff}
        .interactive-row a {color:#5b38a6;margin-right:auto}
        .regression-actions {display:none;align-items:center;gap:8px;flex-shrink:0;height:32px}
        .interactive-row:hover .regression-actions,.interactive-row:focus-within .regression-actions {display:flex}
        .wide .interactive-row {min-height:40px}
        .regression-page :focus-visible {outline:2px solid #7553c8;outline-offset:2px}
      `}</style>
    </ThemeProvider>
  )
}

import { useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { Button } from '@sentry/scraps/button'
import { Checkbox } from '@sentry/scraps/checkbox'
import { Flex } from '@sentry/scraps/layout'
import { TextArea } from '@sentry/scraps/textarea'
import { lightTheme } from '@sentry/scraps/theme'
import './App.css'

const contexts = {
  secondary: { short: 'Release failed', medium: 'Release failed during deployment', long: 'Release failed during deployment to the production environment for the customer-facing service', action: 'Copy link', metadata: ['Duration: 12m', 'Errors: 18'] },
  primary: { short: 'Investigate issue', medium: 'Unexpected application error', long: 'Unexpected application error affecting checkout completion for customers in multiple regions', action: 'Resolve issue', metadata: ['First seen: Today', 'Events: 2.4k'] },
}
const componentTree = `ApplicationShell
├─ Navigation
└─ MainArea
   ├─ DetailPane
   │  └─ DetailHeader
   │     └─ HeaderLayout
   │        ├─ Title
   │        ├─ Metadata
   │        └─ Actions
   └─ NeighboringPanel`

function App() {
  const [paneWidth, setPaneWidth] = useState(560)
  const [scenario, setScenario] = useState<'secondary' | 'primary'>('secondary')
  const [titleLength, setTitleLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [extraMetadata, setExtraMetadata] = useState(false)
  const [architectureNotes, setArchitectureNotes] = useState('')
  const [rolloutNotes, setRolloutNotes] = useState('')
  const [status, setStatus] = useState('')
  const context = contexts[scenario]
  const notes = `Responsive layouts in shared components — candidate notes\n\nARCHITECTURE\n${architectureNotes}\n\nMIGRATION & VERIFICATION\n${rolloutNotes}\n`
  async function copyNotes() {
    try { await navigator.clipboard.writeText(notes); setStatus('Notes copied.') }
    catch { setStatus('Clipboard unavailable. Select and copy your notes, or save them as text.') }
  }
  function downloadNotes() {
    try {
      const url = URL.createObjectURL(new Blob([notes], { type: 'text/plain;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'responsive-component-notes.txt'
      document.body.append(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setStatus('Notes saved as text.')
    } catch { setStatus('Download unavailable. Select and copy your notes instead.') }
  }
  return (
    <ThemeProvider theme={lightTheme}>
      <main className="shell">
        <header className="top">
          <div><p className="eyebrow">Design Engineering Manager · Technical exercise</p><h1>Responsive layouts in shared components</h1><p className="muted intro">A collaborative workspace for exploring user experience, reusable component architecture, and a migration strategy. No production code or knowledge of a specific design system is required.</p></div>
          <span className="session-label">Candidate materials · 60 minutes</span>
        </header>
        <section aria-labelledby="challenge-heading">
          <div className="section-head"><h2 id="challenge-heading"><span>01</span> The challenge</h2><span>Start here</span></div>
          <div className="panel">
            <p className="prompt">A detail header works well when its containing panel is wide, but becomes cramped as the panel narrows. This can happen when a neighboring panel opens, even though the browser viewport stays unchanged.</p>
            <p>The same shared header pattern is used in several product contexts, with different titles, metadata, and actions. Your team wants to improve the responsive behavior without requiring each consuming team to implement its own layout logic.</p>
            <p><strong>Your task:</strong> Propose how the shared component should behave, what its API should expose, and how you would safely migrate existing usages.</p>
            <div className="callout">The examples are synthetic and deliberately imperfect. Ask clarifying questions, challenge assumptions, sketch, annotate, or use pseudocode. We are interested in your decisions and reasoning, not exact syntax. There is no single prescribed layout or API.</div>
          </div>
        </section>
        <section aria-labelledby="layout-heading">
          <div className="section-head"><h2 id="layout-heading"><span>02</span> Explore the layout</h2><span>Example 1 · Interactive sample</span></div>
          <div className="layout">
            <div className="panel preview-panel">
              <div className="vp-label"><span>Illustrative product · fixed 1440px viewport</span><span>Detail pane: <strong>{paneWidth}px</strong></span></div>
              <div className="viewport" tabIndex={0} aria-label="Product preview, horizontally scrollable on smaller screens">
                <div className="product-frame">
                  <div className="product-nav">Product / {scenario === 'secondary' ? 'Release details' : 'Issue details'}</div>
                  <div className="workspace-row">
                    <div className="application-navigation"><strong>Application</strong><p>Navigation and other application space</p><span>480px</span></div>
                    <div className="detail-pane" id="detailPane" style={{ width: paneWidth }}>
                      <Flex className="demo-header" align="start" gap="xl">
                        <div className="heading-block"><h3 className="demo-title" id="demoTitle">{context[titleLength]}</h3><Flex className="metadata" gap="sm" wrap="wrap">{context.metadata.map(item => <span className="metadata-item" key={item}>{item}</span>)}{extraMetadata && <span className="metadata-item">Region: US-East</span>}</Flex></div>
                        <Flex className="demo-actions" gap="sm" flexShrink={0}><Button size="sm" variant={scenario === 'primary' ? 'primary' : 'secondary'}>{context.action}</Button><Button size="sm">More ···</Button></Flex>
                      </Flex>
                      <div className="detail-body" aria-hidden="true"><div className="placeholder-line" /><div className="placeholder-line short" /><div className="placeholder-line" /></div>
                    </div>
                    {paneWidth < 960 && <aside className="neighbor" style={{ width: 960 - paneWidth }}><strong>Related information</strong><div className="placeholder-line" /><div className="placeholder-line short" /><p>Supplementary content alongside the detail pane.</p><span>{960 - paneWidth}px</span></aside>}
                  </div>
                </div>
              </div>
              <div className="metrics"><span>Viewport <strong>1440px</strong></span><span>Pane <strong>{paneWidth}px</strong></span><span>Current layout <strong>Intentionally imperfect</strong></span></div>
              <p className="caption">The fixed 1440px product frame is shown at 60% scale. The pane has the selected width before scaling; resizing it does not change the product viewport. Scroll the preview horizontally if needed. Product action buttons are illustrative.</p>
            </div>
            <aside className="panel controls" aria-label="Example controls">
              <p className="eyebrow">Explore constraints</p>
              <div className="control"><label htmlFor="scenario">Usage context</label><select id="scenario" value={scenario} onChange={event => setScenario(event.target.value === 'primary' ? 'primary' : 'secondary')}><option value="secondary">Release details · secondary actions</option><option value="primary">Issue details · primary action</option></select><small>Compare how different tasks affect action importance.</small></div>
              <div className="control"><label htmlFor="paneWidth">Available pane width <output>{paneWidth}px</output></label><input id="paneWidth" type="range" min="320" max="960" step="20" value={paneWidth} onChange={event => setPaneWidth(Number(event.target.value))} /><Flex gap="sm" wrap="wrap"><Button size="xs" aria-pressed={paneWidth === 960} onClick={() => setPaneWidth(960)}>Wide · 960</Button><Button size="xs" aria-pressed={paneWidth === 560} onClick={() => setPaneWidth(560)}>Panel open · 560</Button><Button size="xs" aria-pressed={paneWidth === 360} onClick={() => setPaneWidth(360)}>Narrow · 360</Button></Flex></div>
              <div className="control"><label htmlFor="titleLength">Title length</label><select id="titleLength" value={titleLength} onChange={event => setTitleLength(event.target.value === 'long' ? 'long' : event.target.value === 'short' ? 'short' : 'medium')}><option value="short">Short</option><option value="medium">Typical</option><option value="long">Long / localized</option></select></div>
              <label className="checkbox-label"><Checkbox checked={extraMetadata} onChange={event => setExtraMetadata(event.target.checked)} />Show additional metadata</label>
              <div className="note">Which information should wrap? Which actions should stay visible? Consider intermediate widths, different content, and keyboard navigation.</div>
            </aside>
          </div>
          <details className="static-fallback panel"><summary>Wide and narrow examples · text fallback</summary><p><strong>Wide, 960px pane:</strong> The title, metadata, Copy link, and More fit in a horizontal header.</p><p><strong>Narrow, 560px pane:</strong> At the same 1440px viewport, the neighboring panel takes 400px. The header keeps its wide arrangement and the More action extends past the pane edge. Longer content adds pressure.</p><p><strong>Second usage:</strong> Issue details uses a primary Resolve issue action rather than Copy link. Consider whether the same component contract works for both.</p></details>
        </section>
        <section aria-labelledby="structure-heading">
          <div className="section-head"><h2 id="structure-heading"><span>03</span> Component structure</h2><span>Starting point, not a required solution</span></div>
          <div className="lower"><div className="panel"><pre className="tree">{componentTree}</pre><p className="caption">The current HeaderLayout uses a horizontal arrangement and switches to a stacked arrangement when the <strong>viewport</strong> is narrower than 800px. Opening the neighboring panel does not change that condition. No responsive container boundary is marked.</p></div><div className="panel"><p className="eyebrow">Architecture discussion</p><p>You can annotate this tree in your notes, sketch a different composition, or describe an API.</p><ul><li>Who owns the available width and responsive boundary?</li><li>Which behavior is standardized by the shared component?</li><li>What can consumers customize without breaking the contract?</li><li>How would a second usage context change your proposal?</li></ul><div className="note">A representative example and an explanation of wide and narrow behavior are sufficient. You do not need a runnable implementation.</div></div></div>
        </section>
        <section aria-labelledby="notes-heading">
          <div className="section-head"><h2 id="notes-heading"><span>04</span> Working notes</h2><span>Optional scratchpad</span></div>
          <div className="lower"><div className="panel"><label htmlFor="architectureNotes" className="notes-label">Responsive behavior & component contract</label><TextArea id="architectureNotes" rows={9} value={architectureNotes} onChange={event => setArchitectureNotes(event.target.value)} placeholder="Sketch the hierarchy, responsive boundary, responsibilities, API, and tradeoffs…" /></div><div className="panel"><label htmlFor="rolloutNotes" className="notes-label">Migration & verification</label><TextArea id="rolloutNotes" rows={9} value={rolloutNotes} onChange={event => setRolloutNotes(event.target.value)} placeholder="Record questions, rollout considerations, testing states, risks, or a pilot plan…" /></div></div>
          <Flex className="notes-actions" align="center" gap="md" wrap="wrap"><Button size="sm" onClick={copyNotes}>Copy notes</Button><Button size="sm" onClick={downloadNotes}>Save notes as text</Button><span role="status">{status}</span></Flex>
        </section>
        <footer>Candidate workspace · Notes remain in this page until copied or saved. Save your notes before refreshing or closing the page. We will reserve the final eight minutes for your questions.</footer>
      </main>
    </ThemeProvider>
  )
}
export default App

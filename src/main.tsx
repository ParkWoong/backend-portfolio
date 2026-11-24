import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { locale, t } from './i18n'
import { projects, type Project } from './projects'
import './styles.css'

const profile = 'https://github.com/ParkWoong'
const tabs = ['architecture', 'design', 'evidence'] as const

function repositoryUrl(project: Project) {
  return `https://github.com/${project.repository}`
}

function Stack({ items }: { items: string[] }) {
  return <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
    {items.map((item) => <li className="tech-tag" key={item}>{item}</li>)}
  </ul>
}

function FlowPreview() {
  return <figure className="flow-preview">
    <figcaption className="flow-caption"><span /> {t.flowTitle}</figcaption>
    <div className="flow-body">
      <div className="flow-inputs">
        <div className="flow-node"><span className="flow-symbol" aria-hidden="true">↔</span><strong>REST</strong></div>
        <div className="flow-node"><span className="flow-symbol" aria-hidden="true">≋</span><strong>WebSocket</strong></div>
      </div>
      <div className="flow-join" aria-hidden="true" />
      <div className="flow-node flow-main"><strong>SymbolSession</strong><small>{t.flowSession}</small></div>
      <div className="flow-line" aria-hidden="true" />
      <div className="flow-node flow-output"><strong>Telegram</strong><small>{t.flowAlert}</small></div>
    </div>
    <p className="flow-note">Binance Futures <span aria-hidden="true">/</span> {t.flowSource}</p>
  </figure>
}

let mermaidModule: ReturnType<typeof loadMermaid> | undefined

async function loadMermaid() {
  const {default: mermaid} = await import('mermaid')
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: {
      primaryColor: '#1f2e27', primaryTextColor: '#e7f5e7', primaryBorderColor: '#557564',
      lineColor: '#91ae9d', edgeLabelBackground: '#12201a', textColor: '#e7f5e7',
      fontFamily: 'system-ui, sans-serif', fontSize: '15px',
    },
    flowchart: {htmlLabels: false, useMaxWidth: false, padding: 14},
  })
  return mermaid
}

let nextDiagramId = 0

function Diagram({ source }: { source: string }) {
  const frame = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let current = true
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !current) return
      observer.disconnect()
      const id = `architecture-${++nextDiagramId}`
      mermaidModule ??= loadMermaid()
      mermaidModule.then((mermaid) => mermaid.render(id, source)).then(({svg}) => {
        if (current) setSvg(svg)
      }).catch(() => {
        if (current) setFailed(true)
      })
    }, {rootMargin: '240px'})
    observer.observe(frame.current!)
    return () => {
      current = false
      observer.disconnect()
    }
  }, [source])

  return <>
    <div ref={frame} className="diagram-frame" tabIndex={0} role="region" aria-label={t.architecture}>
      {svg ? <div className="diagram-content" dangerouslySetInnerHTML={{__html: svg}} />
        : <p className="diagram-status" role="status">{failed ? t.diagramError : t.loading}</p>}
    </div>
    <details className="diagram-source">
      <summary>{t.mermaidSource}</summary>
      <pre><code>{source}</code></pre>
    </details>
  </>
}

function ProjectDetails({ project }: { project: Project }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('architecture')
  const copy = project.content[locale] ?? project.content.ko
  const url = repositoryUrl(project)

  return <article className="case-study" aria-labelledby="case-title">
    <div className="case-header">
      <div>
        <p className="case-category">{copy.category}</p>
        <h3 id="case-title">{copy.title}</h3>
      </div>
      <a className="secondary-button case-link" href={url}>{t.repository}</a>
    </div>
    <div className="tab-bar" role="group" aria-label={t.projectDetails}>
      {tabs.map((item) => <button
        key={item}
        type="button"
        aria-pressed={item === tab}
        aria-controls="case-panel"
        onClick={() => setTab(item)}
      >{t[item]}</button>)}
    </div>
    <div id="case-panel" className="case-panel">
      {tab === 'architecture' && <>
        <div className="architecture-intro">
          <p>{copy.diagramSummary}</p>
          <div>
            <h4>{t.features}</h4>
            <ul>{copy.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </div>
        </div>
        <Diagram source={project.diagrams[locale] ?? project.diagrams.ko} />
      </>}
      {tab === 'design' && <dl className="decision-grid">
        {copy.decisions.map((decision) => <div key={decision.title}>
          <dt>{decision.title}</dt><dd>{decision.text}</dd>
        </div>)}
      </dl>}
      {tab === 'evidence' && <>
        <p className="evidence-intro">{t.evidenceDescription} <a href={`${url}/commit/${project.revision}`}><code>{project.revision.slice(0, 7)}</code></a></p>
        <ul className="evidence-list">{copy.evidence.map(({label, path, commit, lines}) => <li key={label}>
          <a href={commit ? `${url}/commit/${commit}` : `${url}/blob/${project.revision}/${path}${lines ? `#${lines}` : ''}`}>
            <strong>{label}</strong><code>{commit?.slice(0, 7) ?? path}</code>
          </a>
        </li>)}</ul>
      </>}
    </div>
  </article>
}

function projectFromHash() {
  return projects.find((project) => `#${project.id}` === window.location.hash)
}

function App() {
  const [project, setProject] = useState(() => projectFromHash() ?? projects[0])

  useEffect(() => {
    function selectFromHash() {
      const selected = projectFromHash()
      if (selected) setProject(selected)
    }
    window.addEventListener('hashchange', selectFromHash)
    return () => window.removeEventListener('hashchange', selectFromHash)
  }, [])

  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header">
      <div className="page-width header-inner">
        <a className="brand" href="#main"><span className="brand-mark" aria-hidden="true">PW</span><strong>ParkWoong</strong></a>
        <nav aria-label={t.projects} className="flex items-center gap-5 sm:gap-8">
          <a href="#projects">{t.projects}</a>
          <a className="github-link" href={profile}>GitHub</a>
        </nav>
      </div>
    </header>

    <main id="main">
      <section className="page-width hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow" lang="en">BACKEND PORTFOLIO</p>
          <h1 id="hero-title">{t.role}<span lang="en">ParkWoong<span className="hero-period" aria-hidden="true">.</span></span></h1>
          <p className="hero-description">{t.introduction}</p>
          <div className="flex flex-wrap gap-3">
            <a className="primary-button" href="#projects">{t.viewProjects}</a>
            <a className="secondary-button" href={profile}>GitHub</a>
          </div>
        </div>
        <FlowPreview />
      </section>

      <section className="work-section" id="projects" aria-labelledby="projects-title">
        <div className="page-width">
          <div className="work-heading">
            <h2 id="projects-title">{t.selectedWork}</h2>
            <p>{t.selectedDescription}</p>
          </div>
          <div className="project-grid">
            {projects.map((item) => {
              const copy = item.content[locale] ?? item.content.ko
              return <article className="project-card" key={item.id}>
                <p className="card-category">{copy.category}</p>
                <h3><a href={`#${item.id}`} onClick={() => setProject(item)}>{copy.title}</a></h3>
                <p className="project-summary">{copy.summary}</p>
                <Stack items={item.stack} />
                <a className="detail-link" href={`#${item.id}`} onClick={() => setProject(item)} aria-label={`${copy.title} ${t.seeDetails}`}>{t.seeDetails}</a>
              </article>
            })}
          </div>
          <div className="detail-targets">
            {projects.map((item) => <span id={item.id} key={item.id} />)}
          </div>
          <ProjectDetails key={project.id} project={project} />
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="page-width footer-inner"><div><strong>ParkWoong</strong> <span>{t.footer}</span></div><a href={profile}>GitHub</a></div>
    </footer>
  </>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)

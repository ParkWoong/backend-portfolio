import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { locale, t } from './i18n'
import { projectGroups, projects, type Project, type ProjectGroup } from './projects'
import './styles.css'

const profile = 'https://github.com/ParkWoong'
const groupCounts = projectGroups.map((group) => projects.filter((project) => project.group === group).length)
const buildCommands = {
  maven: ['mvn clean verify', 'mvn spring-boot:run'],
  wrapper: ['sh ./mvnw clean verify', 'sh ./mvnw spring-boot:run'],
}

function projectId(project: Project) {
  return project.id ?? project.repository
}

function Stack({ items }: { items: string[] }) {
  return <ul className="flex flex-wrap gap-2" aria-label={t.techStack}>
    {items.map((item) => <li className="tech-tag" key={item}>{item}</li>)}
  </ul>
}

function CatalogOverview() {
  return <aside className="catalog-overview" aria-labelledby="catalog-title">
    <h2 id="catalog-title">{t.catalogTitle}</h2>
    <p className="catalog-total"><strong>{projects.length}</strong> {t.repositories}</p>
    <dl>{projectGroups.map((group, index) => <div key={group}>
      <dt>{t.groups[group]}</dt><dd>{groupCounts[index]}</dd>
    </div>)}</dl>
  </aside>
}

function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null)
  const copy = project.content[locale] ?? project.content.ko
  const commands = project.commands ?? (project.build ? buildCommands[project.build] : [])

  useEffect(() => {
    panel.current?.focus({preventScroll: true})
    panel.current?.scrollIntoView({block: 'start'})
  }, [])

  return <article ref={panel} id={projectId(project)} className="case-study" aria-labelledby="case-title" tabIndex={-1}>
    <div className="case-header">
      <div>
        <p className="case-category">{t.groups[project.group]}</p>
        <h3 id="case-title">{copy.title}</h3>
        <p className="case-repo"><code>{project.repository}</code></p>
      </div>
      <a className="secondary-button case-link" href={`${profile}/${project.repository}`}>{t.repository}</a>
      <button className="case-close" type="button" aria-label={t.closeDetails} onClick={onClose}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div className="case-panel">
      <p className="case-summary">{copy.summary}</p>
      <div className="readme-grid">
        {copy.features.length > 0 && <section className="readme-section">
          <h4>{t.features}</h4>
          <ul className="feature-list">{copy.features.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>}
        {project.stack.length > 0 && <section className="readme-section">
          <h4>{t.techStack}</h4>
          <Stack items={project.stack} />
        </section>}
        <section className="readme-section readme-wide">
          <h4>{t.structure}</h4>
          <dl className="file-list">{copy.structure.map(([path, purpose]) => <div key={path}>
            <dt><code>{path}</code></dt><dd>{purpose}</dd>
          </div>)}</dl>
        </section>
        <section className="readme-section readme-wide">
          <h4>{t.run}</h4>
          <p>{copy.setup ?? t.mavenSetup}</p>
          {commands.length > 0 && <pre><code>{[...(project.directory ? [`cd ${project.directory}`] : []), ...commands].join('\n')}</code></pre>}
        </section>
        <section className="readme-section readme-wide">
          <h4>{t.postman}</h4>
          {copy.postmanNote && <p>{copy.postmanNote}</p>}
          {copy.requests && <div className="request-grid">
            {copy.requests.map((request) => <div className="request-example" key={request.name}>
              <h5>{request.name}</h5>
              <div className="request-line"><strong>{request.method}</strong><code>http://localhost:{project.port ?? 8080}{request.path}</code></div>
              {request.auth && <p>{request.auth}</p>}
              {request.mediaType && <p className="content-type"><code>Content-Type: {request.mediaType}</code></p>}
              {request.body && <pre><code>{typeof request.body === 'string' ? request.body : JSON.stringify(request.body, null, 2)}</code></pre>}
              <p><strong>{t.expected}</strong> {request.expected}</p>
            </div>)}
          </div>}
        </section>
      </div>
    </div>
  </article>
}

function projectFromHash() {
  return projects.find((project) => `#${projectId(project)}` === window.location.hash)
}

function App() {
  const [project, setProject] = useState(projectFromHash)
  const [group, setGroup] = useState<ProjectGroup>()
  const closeFocus = useRef<string | undefined>(undefined)
  const visibleProjects = group ? projects.filter((item) => item.group === group) : projects

  useEffect(() => {
    const selectFromHash = () => setProject(projectFromHash())
    window.addEventListener('hashchange', selectFromHash)
    return () => window.removeEventListener('hashchange', selectFromHash)
  }, [])

  useEffect(() => {
    if (project || !closeFocus.current) return
    const destination = document.getElementById(closeFocus.current) ?? document.getElementById('projects-title')
    destination?.focus()
    closeFocus.current = undefined
  }, [project])

  function closeDetails(item: Project) {
    closeFocus.current = `open-${projectId(item)}`
    window.location.hash = 'projects'
  }

  function filter(next?: ProjectGroup) {
    setGroup(next)
    if (project) window.location.hash = 'projects'
  }

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
        <CatalogOverview />
      </section>

      <section className="work-section" id="projects" aria-labelledby="projects-title">
        <div className="page-width">
          <div className="work-heading">
            <h2 id="projects-title" tabIndex={-1}>{t.projects}</h2>
            <p>{t.collectionDescription}</p>
          </div>
          <div className="catalog-filters" role="group" aria-label={t.filter}>
            <button type="button" aria-pressed={!group} onClick={() => filter()}>{t.all} <span>{projects.length}</span></button>
            {projectGroups.map((item, index) => <button key={item} type="button" aria-pressed={group === item} onClick={() => filter(item)}>
              {t.groups[item]} <span>{groupCounts[index]}</span>
            </button>)}
          </div>
          {project && <ProjectDetails key={projectId(project)} project={project} onClose={() => closeDetails(project)} />}
          <div className="project-grid">
            {visibleProjects.map((item) => {
              const copy = item.content[locale] ?? item.content.ko
              const id = projectId(item)
              return <article className="project-card" key={id}>
                <p className="card-category">{t.groups[item.group]}</p>
                <h3><a href={`#${id}`}>{copy.title}</a></h3>
                <p className="project-summary">{copy.summary}</p>
                {item.stack.length > 0 && <Stack items={item.stack} />}
                <a className="detail-link" id={`open-${id}`} href={`#${id}`} aria-label={`${copy.title} ${t.seeDetails}`}>{t.seeDetails}</a>
              </article>
            })}
          </div>
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="page-width footer-inner"><div><strong>ParkWoong</strong> <span>{t.footer}</span></div><a href={profile}>GitHub</a></div>
    </footer>
  </>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)

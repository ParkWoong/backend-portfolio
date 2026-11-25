export const projectGroups = ['project', 'lab', 'algorithm', 'starter'] as const
export type ProjectGroup = (typeof projectGroups)[number]

type PostmanRequest = {
  name: string
  method: 'GET' | 'POST'
  path: string
  mediaType?: 'application/json' | 'text/plain'
  body?: string | Record<string, unknown>
  auth?: string
  expected: string
}

type ProjectCopy = {
  title: string
  summary: string
  features: string[]
  structure: [path: string, purpose: string][]
  setup?: string
  postmanNote?: string
  requests?: PostmanRequest[]
}

export type Project = {
  // Optional legacy slug keeps links to the original two case studies working.
  id?: string
  repository: string
  group: ProjectGroup
  stack: string[]
  build?: 'maven' | 'wrapper'
  commands?: string[]
  port?: number
  directory?: string
  content: {ko: ProjectCopy; en?: ProjectCopy; ja?: ProjectCopy}
}

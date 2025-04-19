import React from 'react'
import Head from 'next/head'
import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

// This function gets called at build time
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'BookingSystemRules.md')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  
  return {
    props: {
      markdownContent: fileContents
    }
  }
}

export default function BusinessRulesPage({ markdownContent }: { markdownContent: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>SimStudio - Business Rules</title>
        <style>{`
          .markdown-content {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
          }
          .markdown-content h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid #eaeaea;
            padding-bottom: 0.5rem;
          }
          .markdown-content h2 {
            font-size: 2rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #2563eb;
          }
          .markdown-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: #4b5563;
          }
          .markdown-content p {
            margin-bottom: 1rem;
          }
          .markdown-content ul, .markdown-content ol {
            margin-left: 2rem;
            margin-bottom: 1rem;
          }
          .markdown-content li {
            margin-bottom: 0.5rem;
          }
          .markdown-content code {
            background-color: #f3f4f6;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.9em;
          }
          .markdown-content pre {
            background-color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin-bottom: 1rem;
          }
          .markdown-content a {
            color: #2563eb;
            text-decoration: underline;
          }
          .markdown-content blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin-left: 0;
            color: #6b7280;
          }
          .markdown-content hr {
            border: 0;
            border-top: 1px solid #e5e7eb;
            margin: 2rem 0;
          }
          .markdown-content table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1rem;
          }
          .markdown-content th, .markdown-content td {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
            text-align: left;
          }
          .markdown-content th {
            background-color: #f9fafb;
          }
        `}</style>
      </Head>
      
      <div className="markdown-content">
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {markdownContent}
        </pre>
      </div>
    </div>
  )
}

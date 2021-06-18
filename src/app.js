import React from 'react'
import { Layout } from './components/layout'
import { QueryForm } from './components/query-form'
import './app.css'

export const App = () => {
  return (
    <Layout>
      <h1>Query</h1>
      
      <QueryForm />

    </Layout>
  );
}

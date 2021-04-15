import React from 'react'
import styled from 'styled-components'

const SiteWrapper = styled.div`
  // & * { border: 1px solid #f99; }
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  & header {
    padding: 2rem;
    background: #234;
    display: flex;
    justify-content: center;
    align-item: center;
    color: #eee;
    filter: drop-shadow(0 0 5px #00000066);
    & a {
      color: #eee;
      text-decoration: none;
    }
  }
  & main {
    flex: 1;
    width: calc(100% - 4rem);
    max-width: 1080px;
    margin: 2rem auto;
    h1 {
      text-align: center;
      color: #234;
      text-transform: uppercase;
    }
  }
  & footer {
    padding: 2rem;
    background: #345;
    display: flex;
    justify-content: center;
    align-item: center;
    color: #eee;
    filter: drop-shadow(0 0 5px #00000066);
  }
`

export const Layout = ({ children }) => {
  return (
    <SiteWrapper>
      <header role="banner">
        <a href="/">NeuroBridge</a>
      </header>
      <main>
        { children }
      </main>
      <footer>
        &copy; { new Date().getFullYear() }
      </footer>
    </SiteWrapper>
  )
}
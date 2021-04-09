import React, { Fragment } from 'react'
import styled from 'styled-components'

const SiteWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  & header {
    padding: 2rem;
    background: #345;
    display: flex;
    justify-content: center;
    align-item: center;
    color: #eee;
  }
  & main {
    flex: 1;
    width: calc(100% - 4rem);
    max-width: 1080px;
    margin: 3rem auto;
  }
  & footer {
    padding: 2rem;
    background: #345;
    display: flex;
    justify-content: center;
    align-item: center;
    color: #eee;
  }
`

export const Layout = ({ children }) => {
  return (
    <SiteWrapper>
      <header>
        NeuroBridge
      </header>
      <main>
        { children }
      </main>
      <footer>
        &copy; { new Date().getFullYear() } NeuroBridge
      </footer>
    </SiteWrapper>
  )
}
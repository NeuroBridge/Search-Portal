import React from 'react'

export const Layout = ({ children }) => {
  return (
    <div className="main-layout">
      <header role="banner">
        <a href="/">NeuroBridge</a>
      </header>
      <main>
        { children }
      </main>
      <footer>
        &copy; { new Date().getFullYear() }
      </footer>
    </div>
  )
}
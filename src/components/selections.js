import React, { useRef } from 'react'
import styled, { keyframes } from 'styled-components'

const FADE_OUT_DURATION = 500

export const Selections = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const disappear = keyframes`
  0% { filter: opacity(1.0); }
  100% { filter: opacity(0.0); }
`

const SelectionWrapper = styled.div`
  position: relative;
  background-color: #30333c;
  color: #3df;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  & strong {
    color: #29b;
  }
  &:hover .delete-button {
    filter: opacity(0.75) brightness(1.2);
  }
  & .delete-button {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    padding: 0.25rem 0.5rem;
    background-color: transparent;
    color: #222;
    font-size: 120%;
    border: 0;
    border-radius: 4px;
    transition: filter 250ms;
    cursor: pointer;
    filter: opacity(0.5) brightness(1.0);
    &:hover {
      filter: opacity(1.0) brightness(1.2);
    }
  }
  transition: filter 250ms, transform 250ms;
  transform-origin: 50% 0%;
  &.closing {
    animation-name: ${ disappear };
    animation-duration: ${ FADE_OUT_DURATION }ms;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-timing-function: ease-out; /* ease, ease-in, ease-in-out, ease-out, linear, cubic-bezier(x1, y1, x2, y2) */
    animation-delay: 0;
  }
`

export const Selection = ({ selection, onDelete }) => {
  const element = useRef()

  const handleClickDelete = id => event => {
    if (element.current) {
      element.current.classList.add('closing')
      const deleteTimer = setTimeout(() => onDelete(id), FADE_OUT_DURATION)
      return () => clearTimeout(deleteTimer)
    }
  }

  return (
    <SelectionWrapper className="selection" ref={ element }>
      <strong>TABLE:</strong> { selection.table !== '' ? selection.table.name : '...' }<br />
      <strong>CRITERION:</strong> { selection.criterion !== '' ? selection.criterion.name : '...' }<br /><br />
      <strong>ID:</strong> { selection.id || '...' }<br />
      <button className="delete-button" onClick={ handleClickDelete(selection.id) }>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#29b"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      </button>
    </SelectionWrapper>
  )
}
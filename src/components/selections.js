import React, { useRef } from 'react'
import styled, { keyframes } from 'styled-components'

const FADE_IN_DURATION = 333
const FADE_OUT_DURATION = 250

export const Selections = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
`

const appear = keyframes`
  0% { filter: opacity(0.0); display: none; }
  1% { filter: opacity(0.0); display: block; }
  100% { filter: opacity(1.0); }
`

const disappear = keyframes`
  0% { filter: opacity(1.0); }
  100% { filter: opacity(0.0); }
`

const SelectionWrapper = styled.div`
  display: flex;
  position: relative;
  background-color: #30333c;
  color: #3df;
  padding: 1rem;
  margin: 0;
  border-radius: 6px;
  transform: scale(0.99);
  filter: saturate(0.5) drop-shadow(0 0 2px #00000066);
  transition: filter 250ms, transform 750ms;
  transform-origin: 50% 0%;
  animation-name: ${ appear };
  animation-duration: ${ FADE_IN_DURATION }ms;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-timing-function: ease-out; /* ease, ease-in, ease-in-out, ease-out, linear, cubic-bezier(x1, y1, x2, y2) */
  animation-delay: 0;
  & .details {
    flex: 1;
  }
  & .actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    @media (min-width: 768px) {
      flex-direction: row;
    }
  }
  & strong {
    color: #29b;
  }
  &:hover {
    transition: filter 250ms, transform 200ms;
    filter: saturate(1.0) drop-shadow(0 3px 5px #00000066);
    transform: scale(1.0);
  }
  &:hover .edit-button {
    filter: opacity(0.75) brightness(1.2);
  }
  &:hover .delete-button {
    filter: opacity(0.75) brightness(1.2);
  }
  & .actions button {
    display: block;
    height: 100%;
    width: 3rem;
    @media (min-width: 768px) {
      width: 5rem;
    }
    padding: 0.25rem;
    background-color: #30333c;
    color: #222;
    font-size: 120%;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    transition: filter 500ms 50ms, background-color 500ms 50ms;
    filter: opacity(0.5) brightness(1.0);
    &:hover {
      filter: opacity(1.0) brightness(1.2);
      background-color: #40434c;
    }
    &.edit-button {
      & svg {
        fill: #3c8;
        transition: fill 250ms;
      }
    }
    &.delete-button {
      & svg {
        fill: #d35;
        transition: fill 250ms;
      }
    }
  }
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
      <div className="details">
        <strong>TABLE:</strong> { selection.table !== '' ? selection.table.name : '...' }<br />
        <strong>CRITERION:</strong> { selection.criterion !== '' ? selection.criterion.name : '...' }<br /><br />
        <strong>ID:</strong> { selection.id || '...' }<br />
      </div>
      <div className="actions">
        <button className="edit-button">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </button>
        <button className="delete-button" onClick={ handleClickDelete(selection.id) }>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    </SelectionWrapper>
  )
}
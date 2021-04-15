import styled from 'styled-components'

export const QueryField = styled.textarea.attrs({
  rows: 10,
})`
  background-color: #345;
  color: #eee;
  border: 2px solid #023;
  width: 100%;
  height: 5;
  margin: 0;
  border-radius: 5px;
  resize: vertical;
  padding: 1rem;
  line-height: 2;
  filter: opacity(0.75);
  transition: filter 250ms;
  &:hover {
    filter: opacity(1);
  }
  &:focus {
    filter: opacity(1);
  }
`

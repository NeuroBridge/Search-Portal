import { List } from "semantic-ui-react"

function Results ({ term }) {

    return (    
        <List.Item>
            <List.Content>
                <List.Header>{term.label}</List.Header>
                <List.Description>{term.description === null ? "No description found" : `Description: ${term.description}`}</List.Description>
            </List.Content>
        </List.Item>
    )
}

export default Results;
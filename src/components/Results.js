import { List } from "semantic-ui-react"

function Results ({ term }) {

    return (    
        <List.Item>
            <List.Content>
                <List.Header>{term.label}</List.Header>
                <List.Description>Description: {term.description}</List.Description>
            </List.Content>
        </List.Item>
    )
}

export default Results;
import { List } from "antd"

function Results ({ term }) {

    return (    
        <List.Item>
            <List.Item.Meta 
                title={term.label}
                description={term.description === null ? "No description found" : `Description: ${term.description}`}
            />
        </List.Item>
    )
}

export default Results;
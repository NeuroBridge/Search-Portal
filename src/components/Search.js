import { useState } from "react";
import { Form, Button, Input } from "semantic-ui-react"

const Search = props => {
    const [searchVal, setSearchVal] = useState("")

    const handleInputChange = e => {
        setSearchVal(e.target.value)
    }

    const resetInput = () => {
        setSearchVal("")
    }

    const callSearchFn = e => {
        e.preventDefault();

        props.search(searchVal)

        resetInput();
    }

    return (
        <Form>
            <Form.Field 
                id="search-field"
                control={Input}
                label="Enter an ontology id (e.g. Cardiovascular Disease = cdvo"
                placeholder="type an ontology id here"
                value={searchVal}
                onChange={handleInputChange}
            />
            <Form.Field 
                id="submit"
                control={Button}
                content="Search"
                onClick={callSearchFn}
            />
        </Form>
    )
}

export default Search;
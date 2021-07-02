
function Results ({ term }) {

    return (    
        <div className="results">
            <h2>{term.label}</h2>
            <p>{term.annotation[0]}</p>
        </div>
    )
}

export default Results;
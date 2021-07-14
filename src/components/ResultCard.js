import { Card } from "antd"
import { ExpandAltOutlined } from "@ant-design/icons"

function ResultCard ({ term }) {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pharetra vehicula lacus eu euismod. Pellentesque a velit facilisis, pulvinar dolor non, condimentum nunc. Integer sed mi convallis, varius sem nec."
    return (    
        <Card title={term.label} actions={[<ExpandAltOutlined key="open" />]} style={{marginTop: "1.5em"}} hoverable>
            {lorem}
        </Card>
    )
}

export default ResultCard;
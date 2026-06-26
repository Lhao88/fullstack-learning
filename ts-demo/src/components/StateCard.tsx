import {
    Card,
    Col,
    Statistic,

} from 'antd'

const StateCard = ({ title, value }: { title: string; value: number}) => {
    return(
        <>
            <Col xs={24} sm={12} xl={6}>
                <Card>
                    <Statistic title={title} value={value} />       
                </Card>
            </Col>
        </>
    )
}

export default StateCard

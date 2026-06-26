import {
    ReloadOutlined,
    SearchOutlined,
} from '@ant-design/icons'
import {
    Button,
    Card,
    Col,
    Input,
    Row,
    Select,
    Typography,
} from 'antd'

const { Text } = Typography

const SearchCard = () => {
    return (
        <> 
        <Card className="toolbar-card">
            <Row gutter={[12, 12]} align="bottom">
                <Col xs={24} lg={10}>
                    <Text className="field-label">搜索</Text>
                    <Input
                        allowClear
                        prefix={<SearchOutlined />}
                        placeholder="输入任务标题或关键词"
                    />
                </Col>
                <Col xs={24} sm={12} lg={5}>
                    <Text className="field-label">状态</Text>
                    <Select
                        defaultValue="all"
                        options={[
                            { label: '全部', value: 'all' },
                            { label: '待处理', value: 'todo' },
                            { label: '进行中', value: 'doing' },
                            { label: '已完成', value: 'done' },
                        ]}
                    />
                </Col>
                <Col xs={24} sm={12} lg={5}>
                    <Text className="field-label">优先级</Text>
                    <Select
                        defaultValue="all"
                        options={[
                            { label: '全部', value: 'all' },
                            { label: '高', value: 'high' },
                            { label: '中', value: 'medium' },
                            { label: '低', value: 'low' },
                        ]}
                    />
                </Col>
                <Col xs={24} lg={4}>
                    <Button block icon={<ReloadOutlined />}>
                        重置
                    </Button>
                </Col>
            </Row>
        </Card>
        </>
    )
}

export default SearchCard

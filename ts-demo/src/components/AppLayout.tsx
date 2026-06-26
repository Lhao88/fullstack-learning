import {
    AppstoreOutlined,
    InboxOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons'
import {
    ConfigProvider,
    Layout,
    Menu,
    Typography,
} from 'antd'

import DashboardView from '../view/DashboardView'
import TaskListView from '../view/TaskListView'
import ArchiveView from '../view/ArchiveView'
import type { ActiveView } from '../types/activeView'

import { useState } from 'react'

const {  Sider } = Layout
const { Text} = Typography



const AppLayout = () => {
    const [activeView, setActiveView] = useState<ActiveView>('dashboard')
    const renderView = () => {
        if (activeView === 'tasks') {
            return <TaskListView />
        }

        if (activeView === 'archive') {
            return <ArchiveView />
        }

        return <DashboardView />
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 8,
                    colorPrimary: '#1677ff',
                    fontFamily:
                        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                },
            }}
        >
            <Layout className="app-layout">
                <Sider className="app-sider" width={248} breakpoint="lg" collapsedWidth={0}>
                    <div className="brand">
                        <span className="brand-mark">T</span>
                        <div>
                            <strong>任务看板</strong>
                            <Text type="secondary">Week 01 Practice</Text>
                        </div>
                    </div>

                    <Menu
                        className="side-menu"
                        theme="dark"
                        mode="inline"
                        selectedKeys={[activeView]}
                        onClick={({key}) => setActiveView(key as ActiveView)}
                        items={[
                            {
                                key: 'dashboard',
                                icon: <AppstoreOutlined />,
                                label: '工作台',
                            },
                            {
                                key: 'tasks',
                                icon: <UnorderedListOutlined />,
                                label: '任务列表',
                            },
                            {
                                key: 'archive',
                                icon: <InboxOutlined />,
                                label: '归档记录',
                            },
                        ]}
                    />
                </Sider>

                <Layout className="workspace-layout">
                    {renderView()}
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}

export default AppLayout

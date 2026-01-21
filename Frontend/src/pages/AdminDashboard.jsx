import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button, Spinner, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/activity')
                ]);
                setStats(statsRes.data);
                setActivity(activityRes.data);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    const StatCard = ({ title, value, icon, color }) => (
        <Card className="border-0 shadow-sm h-100 rounded-4 transition hover-shadow">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <p className="text-secondary small fw-bold mb-1 text-uppercase tracking-wider">{title}</p>
                        <h2 className="fw-black mb-0">{value}</h2>
                    </div>
                    <div className={`p-3 rounded-4 bg-${color}-light text-${color}`}>
                        <i className={`bi bi-${icon} fs-3`}></i>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h1 className="fw-black display-5 mb-2">Admin Dashboard</h1>
                    <p className="text-muted fs-5 mb-0">Overview of platform performance and activity.</p>
                </div>
                <div className="d-flex gap-3">
                    <Button as={Link} to="/admin/users" variant="primary" className="rounded-pill px-4 fw-bold">
                        Manage Users
                    </Button>
                    <Button as={Link} to="/admin/jobs" variant="outline-primary" className="rounded-pill px-4 fw-bold">
                        Moderate Jobs
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <Row className="g-4 mb-5">
                <Col md={6} lg={3}>
                    <StatCard title="Total Users" value={stats?.totalUsers} icon="people" color="primary" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="Total Jobs" value={stats?.totalJobs} icon="briefcase" color="success" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="Applications" value={stats?.totalApplications} icon="check2-circle" color="info" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="Active Batch" value={stats?.mostActiveBatch} icon="mortarboard" color="warning" />
                </Col>
            </Row>

            {/* Charts Row */}
            <Row className="g-4 mb-5">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Header className="bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                            <h4 className="fw-bold mb-0">User Growth</h4>
                            <Badge bg="primary" className="rounded-pill px-3">Last 7 Days</Badge>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={stats?.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4e73df" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#4e73df" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: '#888' }}
                                            tickFormatter={(str) => {
                                                if (!str) return '';
                                                const date = new Date(str);
                                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                            }}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="#4e73df" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorCount)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Header className="bg-transparent border-0 p-4 pb-0">
                            <h4 className="fw-bold mb-0">Batch Distribution</h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={stats?.batchDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="batch" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                            {stats?.batchDistribution?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'][index % 4]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Recent Activity */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Header className="bg-transparent border-0 p-4 pb-0">
                            <h4 className="fw-bold mb-0">Recent Activity</h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div className="activity-feed">
                                {activity.map((item, idx) => (
                                    <div key={idx} className="d-flex gap-3 mb-4 last-mb-0">
                                        <div className="flex-shrink-0">
                                            <div className={`p-2 rounded-circle bg-${item.type === 'USER_REGISTERED' ? 'primary' : 'success'}-light text-${item.type === 'USER_REGISTERED' ? 'primary' : 'success'} shadow-sm d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                                                <i className={`bi bi-${item.type === 'USER_REGISTERED' ? 'person-plus' : 'briefcase'}`}></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 border-bottom pb-3">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <p className="mb-0 fw-bold">{item.description}</p>
                                                <small className="text-muted">{new Date(item.timestamp).toLocaleString()}</small>
                                            </div>
                                            <p className="small text-muted mb-0">Performed by: <span className="text-primary fw-medium">@{item.user}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Growth Stats */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body className="p-4 text-center">
                            <h5 className="text-secondary small fw-bold mb-3 text-uppercase tracking-wider">New Users (Week)</h5>
                            <h1 className="fw-black text-primary mb-0">+{stats?.newUsersThisWeek}</h1>
                        </Card.Body>
                    </Card>
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Body className="p-4 text-center">
                            <h5 className="text-secondary small fw-bold mb-3 text-uppercase tracking-wider">New Users (Month)</h5>
                            <h1 className="fw-black text-primary mb-0">+{stats?.newUsersThisMonth}</h1>
                        </Card.Body>
                    </Card>

                    <div className="mt-4">
                        <Card className="border-0 shadow-sm rounded-4 bg-indigo-light">
                            <Card.Body className="p-4 text-center">
                                <h5 className="fw-bold mb-2">Platform Status</h5>
                                <Badge bg="success" className="rounded-pill px-3 py-2">LIVE & ACTIVE</Badge>
                                <p className="small text-muted mt-3 mb-0">All systems operational.</p>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;

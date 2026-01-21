import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Card, Badge, Spinner, Modal, Alert } from 'react-bootstrap';
import api from '../api/axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [batchFilter, setBatchFilter] = useState('');
    
    // Sorting State
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');

    // Edit Modal State
    const [showEdit, setShowEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState({ fullName: '', email: '', passingYear: '', role: '' });

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, batchFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = '/admin/users';
            const params = new URLSearchParams();
            if (roleFilter) params.append('role', roleFilter);
            if (batchFilter) params.append('batchYear', batchFilter);
            if (params.toString()) url += `?${params.toString()}`;
            
            const res = await api.get(url);
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditData({
            fullName: user.fullName || '',
            email: user.email || '',
            passingYear: user.passingYear || '',
            role: user.role || 'USER'
        });
        setShowEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/users/${selectedUser.id}`, editData);
            setShowEdit(false);
            fetchUsers();
        } catch (err) {
            console.error("Failed to update user", err);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await api.delete(`/admin/users/${userId}`);
                fetchUsers();
            } catch (err) {
                console.error("Failed to delete user", err);
            }
        }
    };

    const filteredUsers = users.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting logic
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortColumn) return 0;
        
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        // Handle null/undefined values
        if (!aVal) aVal = '';
        if (!bVal) bVal = '';
        
        // For dates
        if (sortColumn === 'createdAt') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Calculate quick stats
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'ADMIN').length;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = users.filter(u => u.createdAt && new Date(u.createdAt) > oneWeekAgo).length;
    const activeBatches = [...new Set(users.filter(u => u.passingYear).map(u => u.passingYear))].length;

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
            <div className="mb-5">
                <h1 className="fw-black display-5 mb-2">User Management</h1>
                <p className="text-muted fs-5">Manage all registered users and their details.</p>
            </div>

            {/* Quick Stats Row */}
            <Row className="g-4 mb-4">
                <Col md={6} lg={3}>
                    <StatCard title="Total Users" value={totalUsers} icon="people" color="primary" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="Admins" value={totalAdmins} icon="shield-check" color="danger" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="New This Week" value={newThisWeek} icon="person-plus" color="success" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="Active Batches" value={activeBatches} icon="mortarboard" color="warning" />
                </Col>
            </Row>

            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-4">
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Control 
                                type="text" 
                                placeholder="Search by name, username, or email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-pill px-4"
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Select 
                                value={roleFilter} 
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="rounded-pill px-4"
                            >
                                <option value="">All Roles</option>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Control 
                                type="text" 
                                placeholder="Filter by Batch (e.g. 2025)" 
                                value={batchFilter}
                                onChange={(e) => setBatchFilter(e.target.value)}
                                className="rounded-pill px-4"
                            />
                        </Col>
                        <Col md={2}>
                            <Button variant="primary" className="w-100 rounded-pill fw-bold" onClick={fetchUsers}>
                                Filter
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th 
                                className="px-4 py-3 border-0 cursor-pointer user-select-none" 
                                onClick={() => handleSort('username')}
                                style={{ cursor: 'pointer' }}
                            >
                                User {sortColumn === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-3 border-0 cursor-pointer user-select-none" 
                                onClick={() => handleSort('role')}
                                style={{ cursor: 'pointer' }}
                            >
                                Role {sortColumn === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-3 border-0 cursor-pointer user-select-none" 
                                onClick={() => handleSort('passingYear')}
                                style={{ cursor: 'pointer' }}
                            >
                                Batch {sortColumn === 'passingYear' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-3 border-0 cursor-pointer user-select-none" 
                                onClick={() => handleSort('createdAt')}
                                style={{ cursor: 'pointer' }}
                            >
                                Registered {sortColumn === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-3 border-0 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </td>
                            </tr>
                        ) : sortedUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">No users found.</td>
                            </tr>
                        ) : (
                            sortedUsers.map(user => (
                                <tr key={user.id} className="align-middle" style={{ transition: 'background-color 0.2s' }}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div 
                                                className="rounded-circle d-flex justify-content-center align-items-center me-3 text-white fw-bold shadow-sm" 
                                                style={{ 
                                                    width: '40px', 
                                                    height: '40px', 
                                                    fontSize: '1rem',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                }}
                                            >
                                                {(user.fullName?.[0] || user.username?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-bold">{user.fullName || user.username}</div>
                                                <div className="text-muted small">@{user.username} • {user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'} className="rounded-pill px-3">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="py-3">{user.passingYear || 'N/A'}</td>
                                    <td className="py-3">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-4 py-3 text-end">
                                        <Button variant="outline-primary" size="sm" className="rounded-pill px-3 me-2" onClick={() => handleEdit(user)}>
                                            Edit
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleDelete(user.id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Edit User Modal */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)} centered className="rounded-4">
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold">Edit User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Full Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editData.fullName}
                                onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                                className="rounded-3"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                value={editData.email}
                                onChange={(e) => setEditData({...editData, email: e.target.value})}
                                className="rounded-3"
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Batch Year</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={editData.passingYear}
                                        onChange={(e) => setEditData({...editData, passingYear: e.target.value})}
                                        className="rounded-3"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Role</Form.Label>
                                    <Form.Select 
                                        value={editData.role}
                                        onChange={(e) => setEditData({...editData, role: e.target.value})}
                                        className="rounded-3"
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button variant="light" className="rounded-pill px-4" onClick={() => setShowEdit(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="rounded-pill px-4 fw-bold">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UserManagement;

import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import api from '../api/axios';

const JobModeration = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [batchFilter, setBatchFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    
    // Sorting State
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetchJobs();
    }, [batchFilter, typeFilter]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            let url = '/admin/jobs';
            const params = new URLSearchParams();
            if (batchFilter) params.append('batchYear', batchFilter);
            if (typeFilter) params.append('jobType', typeFilter);
            if (params.toString()) url += `?${params.toString()}`;
            
            const res = await api.get(url);
            setJobs(res.data);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job post? This action is irreversible.")) {
            try {
                await api.delete(`/admin/jobs/${jobId}`);
                fetchJobs();
            } catch (err) {
                console.error("Failed to delete job", err);
            }
        }
    };

    const filteredJobs = jobs.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase())
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

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        if (!sortColumn) return 0;
        
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        // Handle null/undefined values
        if (!aVal) aVal = '';
        if (!bVal) bVal = '';
        
        // For dates
        if (sortColumn === 'postedDate') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }
        
        // For nested postedBy.username
        if (sortColumn === 'postedBy') {
            aVal = a.postedBy?.username || '';
            bVal = b.postedBy?.username || '';
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Calculate quick stats
    const totalJobs = jobs.length;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const activeJobs = jobs.filter(j => j.postedDate && new Date(j.postedDate) > oneMonthAgo).length;
    
    // Get top company (most postings)
    const companyCount = jobs.reduce((acc, job) => {
        const company = job.company || 'Unknown';
        acc[company] = (acc[company] || 0) + 1;
        return acc;
    }, {});
    const topCompany = Object.keys(companyCount).length > 0 
        ? Object.keys(companyCount).reduce((a, b) => companyCount[a] > companyCount[b] ? a : b)
        : 'N/A';
    
    // Get unique batches
    const uniqueBatches = [...new Set(jobs.filter(j => j.batchYear).map(j => j.batchYear))].length;

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
                <h1 className="fw-black display-5 mb-2">Job Moderation</h1>
                <p className="text-muted fs-5">Monitor and moderate all job postings on the platform.</p>
            </div>

            {/* Quick Stats Row */}
            <Row className="g-4 mb-4">
                <Col md={6} lg={3}>
                    <StatCard title="Total Jobs" value={totalJobs} icon="briefcase" color="primary" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="Active (Month)" value={activeJobs} icon="calendar-check" color="success" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="Top Company" value={topCompany} icon="building" color="info" />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard title="Target Batches" value={uniqueBatches} icon="mortarboard" color="warning" />
                </Col>
            </Row>

            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-4">
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Control 
                                type="text" 
                                placeholder="Search by title or company..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-pill px-4"
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Select 
                                value={typeFilter} 
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="rounded-pill px-4"
                            >
                                <option value="">All Job Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
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
                            <Button variant="primary" className="w-100 rounded-pill fw-bold" onClick={fetchJobs}>
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
                                onClick={() => handleSort('title')}
                                style={{ cursor: 'pointer' }}
                            >
                                Job Detail {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-3 border-0 cursor-pointer user-select-none" 
                                onClick={() => handleSort('postedBy')}
                                style={{ cursor: 'pointer' }}
                            >
                                Posted By {sortColumn === 'postedBy' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-3 border-0 cursor-pointer user-select-none" 
                                onClick={() => handleSort('postedDate')}
                                style={{ cursor: 'pointer' }}
                            >
                                Date {sortColumn === 'postedDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-3 border-0 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </td>
                            </tr>
                        ) : sortedJobs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">No jobs found.</td>
                            </tr>
                        ) : (
                            sortedJobs.map(job => (
                                <tr key={job.id} className="align-middle" style={{ transition: 'background-color 0.2s' }}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div 
                                                className="rounded-circle d-flex justify-content-center align-items-center me-3 text-white fw-bold shadow-sm" 
                                                style={{ 
                                                    width: '40px', 
                                                    height: '40px', 
                                                    fontSize: '1rem',
                                                    background: 'linear-gradient(135deg, #1cc88a 0%, #36b9cc 100%)'
                                                }}
                                            >
                                                {(job.company?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-bold">{job.title}</div>
                                                <div className="text-muted small d-flex align-items-center gap-2">
                                                    <span className="text-primary fw-bold">{job.company}</span>
                                                    <span>•</span>
                                                    <Badge 
                                                        bg={job.jobType === 'Full-time' ? 'success' : job.jobType === 'Internship' ? 'info' : 'secondary'} 
                                                        className="rounded-pill"
                                                    >
                                                        {job.jobType}
                                                    </Badge>
                                                    <Badge bg="warning" text="dark" className="rounded-pill">
                                                        Batch: {job.batchYear}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        {job.postedBy ? (
                                            <div className="small">
                                                <div className="fw-bold">@{job.postedBy.username}</div>
                                                <div className="text-muted">{job.postedBy.email}</div>
                                            </div>
                                        ) : 'System'}
                                    </td>
                                    <td className="py-3 small text-muted">
                                        {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            className="rounded-pill px-3 me-2"
                                            href={job.jobUrl}
                                            target="_blank"
                                        >
                                            View
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleDelete(job.id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
};

export default JobModeration;

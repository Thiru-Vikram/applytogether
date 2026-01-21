import React, { useState, useEffect } from 'react';
import { Offcanvas, ListGroup, Button, Spinner, Badge } from 'react-bootstrap';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const NotificationDrawer = ({ show, handleClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            fetchNotifications();
        }
    }, [show]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (notification) => {
        try {
            // notification.relatedEntityId is followerId for FOLLOW_REQUEST
            await api.post(`/users/followers/${notification.relatedEntityId}/accept`);
            // Mark notification as read or delete it?
            // Usually we mark as read or delete. The backend logic doesn't auto-delete notification.
            await markRead(notification.id);
            fetchNotifications(); // Refresh to show updated state
        } catch (error) {
            console.error("Failed to accept", error);
        }
    };

    const handleReject = async (notification) => {
        try {
            await api.post(`/users/followers/${notification.relatedEntityId}/reject`);
            await markRead(notification.id);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to reject", error);
        }
    };

    const markRead = async (id) => {
        try {
             await api.put(`/notifications/${id}/read`);
             // We can update local state
             setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markRead(notification.id);
        }

        if (notification.type === 'JOB_POST') {
             navigate('/jobs'); 
        } else if (notification.type === 'FOLLOW_ACCEPTED') {
             navigate(`/u/${notification.relatedEntityId}`);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Are you sure you want to clear all notifications?")) return;
        try {
            await api.delete('/notifications');
            setNotifications([]);
        } catch (error) {
            console.error("Failed to clear notifications", error);
        }
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start">
            <Offcanvas.Header closeButton>
                <div className="d-flex justify-content-between align-items-center w-100 me-2">
                    <Offcanvas.Title className="mb-0">Notifications</Offcanvas.Title>
                    {notifications.length > 0 && (
                        <Button 
                            variant="link" 
                            size="sm" 
                            className="text-danger p-0 text-decoration-none fw-bold"
                            onClick={handleClearAll}
                        >
                            Clear All
                        </Button>
                    )}
                </div>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {loading ? (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : notifications.length === 0 ? (
                    <p className="text-center text-muted">No notifications</p>
                ) : (
                    <ListGroup variant="flush">
                        {notifications.map(n => (
                            <ListGroup.Item 
                                key={n.id} 
                                className={`d-flex flex-column gap-2 ${!n.read ? 'bg-light' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleNotificationClick(n)}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <small className="text-muted">{new Date(n.createdAt).toLocaleDateString()}</small>
                                    {!n.read && <Badge bg="primary" pill>New</Badge>}
                                </div>
                                <div className="fw-bold text-dark">{n.type.replace('_', ' ')}</div>
                                <div className="text-secondary">{n.message}</div>
                                
                                {n.type === 'FOLLOW_REQUEST' && !n.read && (
                                    <div className="d-flex gap-2 mt-2">
                                        <Button 
                                            size="sm" 
                                            variant="success" 
                                            onClick={(e) => { e.stopPropagation(); handleAccept(n); }}
                                        >
                                            Accept
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="danger" 
                                            onClick={(e) => { e.stopPropagation(); handleReject(n); }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default NotificationDrawer;

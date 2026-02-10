import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon, color }) => (
  <Card className="border-0 shadow-sm h-100 rounded-4 transition hover-shadow">
    <Card.Body className="p-4">
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div className="flex-grow-1 overflow-hidden">
          <p className="text-secondary small fw-bold mb-1 text-uppercase tracking-wider text-truncate">
            {title}
          </p>
          <h2 className="fw-black mb-0 text-truncate">{value}</h2>
        </div>
        <div 
          className={`rounded-4 bg-${color}-light text-${color} d-flex align-items-center justify-content-center flex-shrink-0`}
          style={{ width: '56px', height: '56px' }}
        >
          <i className={`bi bi-${icon} fs-3`}></i>
        </div>
      </div>
    </Card.Body>
  </Card>
);

export default StatCard;

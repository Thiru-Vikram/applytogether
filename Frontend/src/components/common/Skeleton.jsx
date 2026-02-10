import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

const Skeleton = ({ width, height, borderRadius = '4px', className = '' }) => {
  return (
    <div 
      className={`skeleton-loading ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '20px', 
        borderRadius,
        backgroundColor: '#e2e8f0'
      }}
    />
  );
};

export const JobCardSkeleton = () => (
  <Col xs={12} sm={6} md={6} lg={4} xl={3}>
    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
      <Skeleton width="70%" height="24px" className="mb-2" />
      <Skeleton width="40%" height="18px" className="mb-4" />
      
      <Skeleton width="50%" height="16px" className="mb-2" />
      <div className="d-flex gap-2 mb-4">
        <Skeleton width="60px" height="24px" borderRadius="20px" />
        <Skeleton width="60px" height="24px" borderRadius="20px" />
      </div>
      
      <Skeleton width="60%" height="14px" className="mb-2" />
      <Skeleton width="40%" height="14px" className="mb-4" />
      
      <div className="mt-auto d-flex flex-column gap-2">
        <Skeleton height="32px" borderRadius="20px" />
        <Skeleton height="32px" borderRadius="20px" />
      </div>
    </Card>
  </Col>
);

export default Skeleton;

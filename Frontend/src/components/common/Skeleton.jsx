import React from "react";
import { Card, Placeholder } from "react-bootstrap";

const SkeletonLine = ({ width = "100%", height = "16px" }) => (
  <Placeholder
    as="div"
    animation="glow"
    className="mb-2"
    style={{ width, height }}
  >
    <Placeholder xs={12} />
  </Placeholder>
);

export const JobCardSkeleton = () => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body>
        <SkeletonLine width="70%" height="24px" />
        <div className="mb-2" />
        <SkeletonLine width="50%" height="16px" />
        <div className="mb-3" />
        <SkeletonLine height="16px" />
        <div className="mb-2" />
        <SkeletonLine height="16px" />
        <div className="mb-3" />
        <SkeletonLine height="32px" />
      </Card.Body>
    </Card>
  );
};

export const StatCardSkeleton = () => {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <SkeletonLine width="60%" height="16px" />
        <div className="mb-2" />
        <SkeletonLine width="40%" height="32px" />
      </Card.Body>
    </Card>
  );
};

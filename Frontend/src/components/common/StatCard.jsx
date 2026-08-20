import React from "react";
import { Card } from "react-bootstrap";

const StatCard = ({ title, value, icon, color = "primary" }) => {
  return (
    <Card
      className="bg-white rounded-4 shadow-sm h-100"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p
              className="text-secondary small fw-bold mb-1 text-uppercase"
              style={{ letterSpacing: "0.04em" }}
            >
              {title}
            </p>
            <h3 className="fw-bold mb-0 text-dark">{value || 0}</h3>
          </div>
          {icon && (
            <div
              className={`p-3 rounded-4 bg-${color} bg-opacity-10 text-${color} d-flex align-items-center justify-content-center flex-shrink-0`}
              style={{ width: "48px", height: "48px", fontSize: "1.3rem" }}
            >
              <i className={`bi bi-${icon}`}></i>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;

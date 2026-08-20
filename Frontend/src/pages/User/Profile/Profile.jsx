import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Badge,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import NotificationDrawer from "../../../components/NotificationDrawer";

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Drawer State
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const targetUserId = userId || (currentUser && currentUser.userId);

  // Relationship State (for Modal UI)
  const [myFollowingIds, setMyFollowingIds] = useState(new Set());
  const [myFollowerIds, setMyFollowerIds] = useState(new Set());

  useEffect(() => {
    if (currentUser) {
      fetchMyRelationships();
    }
  }, [currentUser]);

  useEffect(() => {
    if (
      currentUser &&
      profileUser &&
      currentUser.sub === profileUser.username
    ) {
      checkUnreadNotifications();
    }
  }, [currentUser, profileUser]);

  const checkUnreadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      const unread = res.data.some((n) => !n.read);
      setHasUnread(unread);
    } catch (error) {
      console.error("Failed to check notifications", error);
    }
  };

  const fetchMyRelationships = async () => {
    try {
      const [followingRes, followersRes] = await Promise.all([
        api.get(`/users/${currentUser.userId}/following`),
        api.get(`/users/${currentUser.userId}/followers`),
      ]);
      setMyFollowingIds(new Set(followingRes.data.map((u) => u.id)));
      setMyFollowerIds(new Set(followersRes.data.map((u) => u.id)));
    } catch (error) {
      console.error("Error fetching relationships", error);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchProfileData();
    }
  }, [targetUserId]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userRes = await api.get(`/users/${targetUserId}`);
      setProfileUser(userRes.data);

      const jobsRes = await api.get(`/jobs/user/${targetUserId}`);
      setJobs(jobsRes.data.content || []);

      const followersRes = await api.get(
        `/users/${targetUserId}/followers/count`,
      );
      setFollowersCount(followersRes.data);

      const followingRes = await api.get(
        `/users/${targetUserId}/following/count`,
      );
      setFollowingCount(followingRes.data);

      if (
        currentUser &&
        currentUser.userId.toString() === targetUserId.toString()
      ) {
        const appsRes = await api.get("/applications/my-applications");
        setApplications(appsRes.data);
      }

      if (
        currentUser &&
        currentUser.userId.toString() !== targetUserId.toString()
      ) {
        const isFollowingRes = await api.get(
          `/users/${targetUserId}/is-following`,
        );
        setIsFollowing(isFollowingRes.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    setActionLoading(true);
    try {
      if (isFollowing) {
        await api.post(`/users/${targetUserId}/unfollow`);
        setFollowersCount((prev) => prev - 1);
        const newSet = new Set(myFollowingIds);
        newSet.delete(parseInt(targetUserId));
        setMyFollowingIds(newSet);
      } else {
        await api.post(`/users/${targetUserId}/follow`);
        setFollowersCount((prev) => prev + 1);
        const newSet = new Set(myFollowingIds);
        newSet.add(parseInt(targetUserId));
        setMyFollowingIds(newSet);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalUserFollow = async (user) => {
    try {
      if (myFollowingIds.has(user.id)) {
        await api.post(`/users/${user.id}/unfollow`);
        const newSet = new Set(myFollowingIds);
        newSet.delete(user.id);
        setMyFollowingIds(newSet);
      } else {
        await api.post(`/users/${user.id}/follow`);
        const newSet = new Set(myFollowingIds);
        newSet.add(user.id);
        setMyFollowingIds(newSet);
      }
    } catch (error) {
      console.error("Failed to toggle follow in modal", error);
    }
  };

  const openFollowersModal = async () => {
    setModalTitle("Followers");
    setShowModal(true);
    setModalLoading(true);
    try {
      const res = await api.get(`/users/${targetUserId}/followers`);
      setModalUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch followers", error);
    } finally {
      setModalLoading(false);
    }
  };

  const openFollowingModal = async () => {
    setModalTitle("Following");
    setShowModal(true);
    setModalLoading(true);
    try {
      const res = await api.get(`/users/${targetUserId}/following`);
      setModalUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch following", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalUsers([]);
  };

  const getRelationshipButton = (user) => {
    if (!currentUser || user.id === currentUser.userId) return null;

    const iFollowThem = myFollowingIds.has(user.id);
    const theyFollowMe = myFollowerIds.has(user.id);

    if (iFollowThem && theyFollowMe) {
      return (
        <Button
          variant="success"
          size="sm"
          className="rounded-pill px-3"
          disabled
        >
          Friends
        </Button>
      );
    } else if (iFollowThem) {
      return (
        <Button
          variant="outline-secondary"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => handleModalUserFollow(user)}
        >
          Following
        </Button>
      );
    } else if (theyFollowMe) {
      return (
        <Button
          variant="primary"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => handleModalUserFollow(user)}
        >
          Follow Back
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline-primary"
          size="sm"
          className="rounded-pill px-3"
          onClick={() => handleModalUserFollow(user)}
        >
          Follow
        </Button>
      );
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!profileUser)
    return <div className="text-center mt-5">User not found</div>;

  const isMyProfile =
    currentUser && currentUser.userId.toString() === targetUserId.toString();

  return (
    <Container className="py-5">
      {/* Profile Header Block */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3 display-5">
          {isMyProfile ? "My Profile" : "User Profile"}
        </h1>
        <p className="text-muted fs-6">
          Manage your professional presence and track your contributions.
        </p>
      </div>

      <div className="mb-5">
        <Card
          className="bg-white rounded-4 shadow-sm overflow-hidden position-relative"
          style={{ border: "1px solid #e2e8f0" }}
        >
          <Card.Body className="p-4">
            <div className="d-flex flex-column flex-md-row align-items-center gap-4 text-center text-md-start">
              {/* Avatar */}
              <div
                className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm"
                style={{
                  width: "110px",
                  height: "110px",
                  fontSize: "3rem",
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)",
                  zIndex: 2,
                }}
              >
                {profileUser.fullName
                  ? profileUser.fullName.charAt(0).toUpperCase()
                  : profileUser.username.charAt(0).toUpperCase()}
              </div>

              <div className="flex-grow-1">
                {/* Username + Action Buttons row */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-3 justify-content-center justify-content-md-start">
                  <h2
                    className="fw-bold mb-0 text-dark"
                    style={{ fontSize: "1.5rem" }}
                  >
                    @{profileUser.username}
                  </h2>

                  {!isMyProfile && (
                    <Button
                      variant={isFollowing ? "outline-secondary" : "primary"}
                      onClick={handleFollowToggle}
                      disabled={actionLoading}
                      className="rounded-pill px-4 py-1 fw-bold shadow-sm"
                      size="sm"
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                  {isMyProfile && (
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        as={Link}
                        to="/post-job"
                        variant="primary"
                        size="sm"
                        className="rounded-pill px-3 py-1 fw-bold shadow-sm"
                      >
                        <i className="bi bi-plus-lg me-1"></i>Post a Job
                      </Button>
                      <div
                        className="p-1 rounded-circle bg-light shadow-sm d-flex align-items-center justify-content-center border"
                        style={{
                          width: "36px",
                          height: "36px",
                          cursor: "pointer",
                          borderColor: "#e2e8f0",
                        }}
                        onClick={() => {
                          setShowNotifications(true);
                          setHasUnread(false);
                        }}
                      >
                        <i
                          className={`bi bi-bell-fill fs-5 ${hasUnread ? "text-danger" : "text-primary"}`}
                        ></i>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instagram-style Inline Stats */}
                <div className="d-flex align-items-center gap-4 mb-3 justify-content-center justify-content-md-start fs-6">
                  <span>
                    <strong className="text-dark fw-bold">{jobs.length}</strong>{" "}
                    <span className="text-secondary">posts</span>
                  </span>
                  <span
                    onClick={openFollowersModal}
                    style={{ cursor: "pointer" }}
                    className="text-decoration-none"
                  >
                    <strong className="text-dark fw-bold">{followersCount}</strong>{" "}
                    <span className="text-secondary">followers</span>
                  </span>
                  <span
                    onClick={openFollowingModal}
                    style={{ cursor: "pointer" }}
                    className="text-decoration-none"
                  >
                    <strong className="text-dark fw-bold">{followingCount}</strong>{" "}
                    <span className="text-secondary">following</span>
                  </span>
                </div>

                {/* Full name */}
                {profileUser.fullName && (
                  <div className="fw-semibold text-dark">
                    {profileUser.fullName}
                  </div>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Posts Section */}

      {/* Posts Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Posts</h4>
      </div>

      {jobs.length === 0 ? (
        <div
          className="text-center py-5 bg-white rounded-4 shadow-sm"
          style={{ border: "1px solid #e2e8f0" }}
        >
          <div className="mb-4">
            <i
              className="bi bi-grid-3x3-gap"
              style={{ fontSize: "4rem", color: "#cbd5e1" }}
            ></i>
          </div>
          <h5 className="fw-bold mb-2">No posts yet</h5>
          <p className="text-secondary mb-0">
            {isMyProfile
              ? "Share some job opportunities with your network!"
              : "This user hasn't posted any jobs yet."}
          </p>
        </div>
      ) : (
        <Row className="g-4">
          {jobs.map((job) => (
            <Col key={job.id} xs={12} md={6} lg={4}>
              <Card
                className="h-100 bg-white shadow-sm rounded-4 overflow-hidden"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm me-3 flex-shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "1rem",
                        background:
                          "linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)",
                      }}
                    >
                      {(job.company?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <h6 className="fw-bold mb-0 text-truncate text-dark">
                        {job.title}
                      </h6>
                      <p className="text-primary fw-bold mb-0 small text-truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      <Badge
                        bg={
                          job.jobType === "Full-time"
                            ? "success"
                            : job.jobType === "Internship"
                              ? "info"
                              : "secondary"
                        }
                        className="rounded-pill px-2 py-1 small"
                      >
                        {job.jobType || "Full-time"}
                      </Badge>
                      {job.batchYear && (
                        <Badge
                          bg="warning"
                          text="dark"
                          className="rounded-pill px-2 py-1 small"
                        >
                          Batch: {job.batchYear}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>
                      {job.postedDate
                        ? new Date(job.postedDate).toLocaleDateString()
                        : "N/A"}
                    </small>
                    <Link
                      to={`/search`}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                    >
                      View
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Followers/Following Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="p-0"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {modalLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : modalUsers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No users found.</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {modalUsers.map((user) => (
                <div
                  key={user.id}
                  className="list-group-item border-0 d-flex align-items-center gap-3 py-3 px-4"
                >
                  <Link
                    to={`/u/${user.id}`}
                    className="text-decoration-none"
                    onClick={handleCloseModal}
                  >
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 text-white fw-bold shadow-sm"
                      style={{
                        width: "45px",
                        height: "45px",
                        fontSize: "1.1rem",
                        background:
                          "linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)",
                      }}
                    >
                      {user.fullName
                        ? user.fullName.charAt(0).toUpperCase()
                        : user.username.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <div className="flex-grow-1 overflow-hidden">
                    <Link
                      to={`/u/${user.id}`}
                      className="text-decoration-none text-dark"
                      onClick={handleCloseModal}
                    >
                      <h6 className="fw-bold mb-0 text-truncate">
                        {user.fullName || user.username}
                      </h6>
                    </Link>
                    <p className="text-muted small mb-0 text-truncate">
                      @{user.username}
                    </p>
                  </div>
                  {getRelationshipButton(user)}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <NotificationDrawer
        show={showNotifications}
        handleClose={() => setShowNotifications(false)}
      />
    </Container>
  );
};

export default Profile;

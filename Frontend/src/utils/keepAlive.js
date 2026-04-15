const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '');

export const pingBackend = () => {
  fetch(`${BACKEND_URL}/actuator/health`)
    .catch(() => {}); // silent fail
};
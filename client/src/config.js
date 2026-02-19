// Backend API base URL (backend runs on port 5000 to avoid conflict with Vite on 3000)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

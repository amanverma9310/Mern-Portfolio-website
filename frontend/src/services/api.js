// Central API client. Every network call to the backend goes through here
// instead of being scattered across components.
//
// Set VITE_API_URL in a .env file at the project root, e.g.:
//   VITE_API_URL=http://localhost:5000/api        (development)
//   VITE_API_URL=https://your-backend.onrender.com/api   (production)

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { method = "GET", body, headers } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      credentials: "include", // send/receive the httpOnly admin auth cookie
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Network failure (backend down, no internet, CORS block, etc.)
    throw new ApiError("Can't reach the server. Please try again shortly.", 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no/invalid JSON body
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status);
  }

  return data;
}

// Separate from `request()` because file uploads need multipart/form-data,
// not JSON — the browser sets that Content-Type header itself (with the
// correct boundary) as long as we don't set one manually.
async function uploadFile(path, file, fieldName = "image") {
  const formData = new FormData();
  formData.append(fieldName, file);

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch (err) {
    throw new ApiError("Can't reach the server. Please try again shortly.", 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no/invalid JSON body
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Upload failed (${res.status})`, res.status);
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
  upload: (path, file, fieldName) => uploadFile(path, file, fieldName),
};

export { ApiError, BASE_URL };

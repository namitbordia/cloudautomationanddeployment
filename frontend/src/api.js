const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function request(path, options = {}, sessionToken = "") {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  const payload = await response.json();
  return payload.data ?? payload;
}

export function createAnonymousSession() {
  return request("/auth/anonymous", { method: "POST" });
}

export function submitCheckIn(payload, sessionToken) {
  return request("/check-ins", {
    method: "POST",
    body: JSON.stringify(payload),
  }, sessionToken);
}

export function fetchDashboard(sessionToken) {
  return request("/dashboard", {}, sessionToken);
}

export function createTask(payload, sessionToken) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  }, sessionToken);
}

export function toggleTask(taskId, sessionToken) {
  return request(`/tasks/${taskId}/toggle`, {
    method: "PATCH",
  }, sessionToken);
}

export function fetchCommunityInsights() {
  return request("/community/insights");
}

export function fetchSuggestions(payload, sessionToken) {
  return request("/suggestions", {
    method: "POST",
    body: JSON.stringify(payload),
  }, sessionToken);
}

export function fetchGroups(sessionToken, interest = "") {
  const query = interest ? `?interest=${encodeURIComponent(interest)}` : "";
  return request(`/groups${query}`, {}, sessionToken);
}

export function createGroup(payload, sessionToken) {
  return request("/groups", {
    method: "POST",
    body: JSON.stringify(payload),
  }, sessionToken);
}

export function joinGroup(groupId, sessionToken) {
  return request(`/groups/${groupId}/join`, {
    method: "POST",
  }, sessionToken);
}

export function fetchGroupMessages(groupId, sessionToken) {
  return request(`/groups/${groupId}/messages`, {}, sessionToken);
}

export function sendGroupMessage(groupId, payload, sessionToken) {
  return request(`/groups/${groupId}/messages`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, sessionToken);
}

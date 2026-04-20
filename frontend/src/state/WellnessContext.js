import { createContext, useContext, useEffect, useState } from "react";
import {
  createAnonymousSession,
  createGroup as createGroupRequest,
  createTask,
  fetchCommunityInsights,
  fetchDashboard,
  fetchGroupMessages,
  fetchGroups,
  fetchSuggestions,
  joinGroup as joinGroupRequest,
  sendGroupMessage,
  submitCheckIn,
  toggleTask,
} from "../api";

const WellnessContext = createContext(null);

export function WellnessProvider({ children }) {
  const [anonymousId, setAnonymousId] = useState(localStorage.getItem("anonymousId") || "");
  const [sessionToken, setSessionToken] = useState(localStorage.getItem("sessionToken") || "");
  const [dashboard, setDashboard] = useState(null);
  const [community, setCommunity] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupMessages, setGroupMessages] = useState({});
  const [latestSuggestions, setLatestSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshCommunity();
  }, []);

  useEffect(() => {
    if (sessionToken) {
      refreshDashboard(sessionToken);
    }
  }, [sessionToken]);

  async function createSession() {
    try {
      setLoading(true);
      setError("");
      const session = await createAnonymousSession();
      localStorage.setItem("anonymousId", session.anonymousId);
      localStorage.setItem("sessionToken", session.token);
      setAnonymousId(session.anonymousId);
      setSessionToken(session.token);
      return session;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function refreshDashboard(token = sessionToken) {
    if (!token) {
      return null;
    }

    try {
      const data = await fetchDashboard(token);
      setDashboard(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }

  async function refreshCommunity() {
    try {
      const data = await fetchCommunityInsights();
      setCommunity(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }

  async function refreshGroups(interest = "") {
    if (!sessionToken) {
      return [];
    }

    try {
      const data = await fetchGroups(sessionToken, interest);
      setGroups(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }

  async function submitMoodEntry(payload) {
    if (!sessionToken) {
      setError("Start an anonymous session first.");
      return null;
    }

    try {
      setLoading(true);
      setError("");
      const entry = await submitCheckIn(payload, sessionToken);
      setLatestSuggestions(entry.suggestions || []);
      await Promise.all([refreshDashboard(), refreshCommunity()]);
      return entry;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function refreshGroupMessages(groupId) {
    if (!sessionToken) {
      setError("Start an anonymous session first.");
      return [];
    }

    try {
      const data = await fetchGroupMessages(groupId, sessionToken);
      setGroupMessages((current) => ({ ...current, [groupId]: data }));
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }

  async function generateSuggestions(payload) {
    if (!sessionToken) {
      setError("Start an anonymous session first.");
      return null;
    }

    try {
      setLoading(true);
      setError("");
      const result = await fetchSuggestions(payload, sessionToken);
      setLatestSuggestions(result.suggestions || []);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function createEvent(payload) {
    if (!sessionToken) {
      setError("Start an anonymous session first.");
      return null;
    }

    try {
      setLoading(true);
      setError("");
      const created = await createTask(payload, sessionToken);
      await refreshDashboard();
      return created;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function createInterestGroup(payload) {
    if (!sessionToken) {
      setError("Start an anonymous session first.");
      return null;
    }

    try {
      setLoading(true);
      setError("");
      const created = await createGroupRequest(payload, sessionToken);
      await refreshGroups();
      return created;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function joinInterestGroup(groupId, interest = "") {
    if (!sessionToken) {
      setError("Start an anonymous session first.");
      return null;
    }

    try {
      setLoading(true);
      setError("");
      const joined = await joinGroupRequest(groupId, sessionToken);
      await refreshGroups(interest);
      await refreshGroupMessages(groupId);
      return joined;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function postGroupMessage(groupId, message) {
    if (!sessionToken) {
      setError("Start an anonymous session first.");
      return null;
    }

    try {
      setLoading(true);
      setError("");
      const sent = await sendGroupMessage(groupId, { message }, sessionToken);
      setGroupMessages((current) => ({
        ...current,
        [groupId]: [...(current[groupId] || []), sent],
      }));
      return sent;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function toggleEvent(taskId) {
    if (!sessionToken) {
      setError("Start an anonymous session first.");
      return null;
    }

    try {
      setLoading(true);
      setError("");
      const updated = await toggleTask(taskId, sessionToken);
      await refreshDashboard();
      return updated;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem("anonymousId");
    localStorage.removeItem("sessionToken");
    setAnonymousId("");
    setSessionToken("");
    setDashboard(null);
    setGroups([]);
    setGroupMessages({});
    setLatestSuggestions([]);
    setError("");
  }

  const value = {
    anonymousId,
    sessionToken,
    dashboard,
    community,
    groups,
    groupMessages,
    latestSuggestions,
    loading,
    error,
    createSession,
    refreshDashboard,
    refreshCommunity,
    refreshGroups,
    refreshGroupMessages,
    submitMoodEntry,
    generateSuggestions,
    createInterestGroup,
    joinInterestGroup,
    postGroupMessage,
    createEvent,
    toggleEvent,
    signOut,
  };

  return <WellnessContext.Provider value={value}>{children}</WellnessContext.Provider>;
}

export function useWellness() {
  const context = useContext(WellnessContext);

  if (!context) {
    throw new Error("useWellness must be used within a WellnessProvider");
  }

  return context;
}

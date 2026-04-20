import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import MoodCheckInPage from "./pages/MoodCheckInPage";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import GroupsPage from "./pages/GroupsPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import { WellnessProvider } from "./state/WellnessContext";

function App() {
  return (
    <WellnessProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<AppLayout />}>
            <Route path="/check-in" element={<MoodCheckInPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/suggestions" element={<SuggestionsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WellnessProvider>
  );
}

export default App;

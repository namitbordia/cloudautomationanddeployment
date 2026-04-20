import { useState } from "react";
import MoodPicker from "../components/MoodPicker";
import SectionHeader from "../components/SectionHeader";
import { useWellness } from "../state/WellnessContext";

function MoodCheckInPage() {
  const { submitMoodEntry, loading, latestSuggestions } = useWellness();
  const [selectedMood, setSelectedMood] = useState("neutral");
  const [journalNote, setJournalNote] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const saved = await submitMoodEntry({ mood: selectedMood, journalNote });
    if (saved) {
      setJournalNote("");
      setSelectedMood("neutral");
    }
  }

  return (
    <div className="pageStack">
      <SectionHeader
        eyebrow="Mood Check-In"
        title="How are you feeling today?"
        description="Capture your mood, add an optional note, and get lightweight suggestions shaped by workload and tone."
      />

      <section className="twoColumn">
        <form className="panelCard" onSubmit={handleSubmit}>
          <MoodPicker value={selectedMood} onChange={setSelectedMood} />
          <label className="fieldLabel" htmlFor="journal-note">
            Optional journal note
          </label>
          <textarea
            id="journal-note"
            rows="8"
            value={journalNote}
            onChange={(event) => setJournalNote(event.target.value)}
            placeholder="What is shaping today: exams, sleep, motivation, deadlines, friendships?"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Saving check-in..." : "Save check-in"}
          </button>
        </form>

        <aside className="panelCard suggestionPanel">
          <h3>After-check-in support</h3>
          <p className="muted">
            Suggestions stay non-clinical and practical, with a focus on routine, pacing, and help-seeking.
          </p>
          {latestSuggestions.length ? (
            <ul className="insightList">
              {latestSuggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Your latest suggestions will appear here after a check-in.</p>
          )}
        </aside>
      </section>
    </div>
  );
}

export default MoodCheckInPage;

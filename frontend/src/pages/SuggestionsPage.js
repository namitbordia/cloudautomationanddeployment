import { useState } from "react";
import MoodPicker from "../components/MoodPicker";
import SectionHeader from "../components/SectionHeader";
import { useWellness } from "../state/WellnessContext";

function SuggestionsPage() {
  const { latestSuggestions, community, generateSuggestions, loading } = useWellness();
  const [selectedMood, setSelectedMood] = useState("stressed");
  const [journalNote, setJournalNote] = useState("");

  const suggestions = latestSuggestions.length
    ? latestSuggestions
    : [
        "Choose a mood and generate rule-based suggestions.",
        "Suggestions are instant and based on simple backend rules.",
        "This stays fast and easy to extend because there is no AI or ML in the loop.",
      ];

  async function handleGenerate(event) {
    event.preventDefault();
    await generateSuggestions({ mood: selectedMood, journalNote });
  }

  return (
    <div className="pageStack">
      <SectionHeader
        eyebrow="Suggestions"
        title="Rule-based support prompts"
        description="Generate lightweight wellness suggestions instantly from simple JavaScript rules."
      />

      <section className="twoColumn">
        <article className="panelCard">
          <h3>Generate suggestions</h3>
          <form onSubmit={handleGenerate}>
            <MoodPicker value={selectedMood} onChange={setSelectedMood} />
            <label className="fieldLabel" htmlFor="suggestion-note">
              Optional context
            </label>
            <textarea
              id="suggestion-note"
              rows="6"
              value={journalNote}
              onChange={(event) => setJournalNote(event.target.value)}
              placeholder="Add a note like exam stress, tiredness, or motivation issues..."
            />
            <button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Get suggestions"}
            </button>
          </form>
        </article>

        <article className="panelCard">
          <h3>Your latest suggestions</h3>
          <ul className="insightList">
            {suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panelCard">
          <h3>Community context</h3>
          <p className="muted">
            Anonymous aggregate data can help students feel less isolated during busy weeks.
          </p>
          <p className="muted">
            {community?.today?.publicSummary || "Public community summaries appear when enough anonymous data is available."}
          </p>
          <div className="communityFacts">
            {Object.entries(community?.moodBreakdown || {}).map(([mood, value]) => (
              <div key={mood} className="communityFact">
                <strong>{value}</strong>
                <span>{mood}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default SuggestionsPage;

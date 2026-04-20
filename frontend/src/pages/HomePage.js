import { Link, Navigate } from "react-router-dom";
import { useWellness } from "../state/WellnessContext";

function HomePage() {
  const { anonymousId, loading, createSession } = useWellness();

  if (anonymousId) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="landingShell">
      <section className="landingHero">
        <div className="heroCopy">
          <p className="eyebrow">Non-Clinical | Anonymous | Student Friendly</p>
          <h1>Check in with your mind the same way you track your deadlines.</h1>
          <p className="heroText">
            A calm digital space for mood logging, assignment awareness, and light-touch support
            prompts without collecting personal identity data.
          </p>
          <div className="heroActions">
            <button type="button" onClick={createSession} disabled={loading}>
              {loading ? "Creating anonymous session..." : "Start anonymously"}
            </button>
            <Link className="ghostLink" to="/dashboard">
              Preview the app
            </Link>
          </div>
        </div>

        <div className="heroPanel">
          <div className="floatingCard">
            <span className="miniLabel">Mood pulse</span>
            <strong>Daily reflection</strong>
            <p>Log how today feels in under a minute.</p>
          </div>
          <div className="floatingCard alt">
            <span className="miniLabel">Academic balance</span>
            <strong>Exam + assignment radar</strong>
            <p>See upcoming pressure before it spikes.</p>
          </div>
          <div className="floatingCard accent">
            <span className="miniLabel">Community view</span>
            <strong>Anonymous trends</strong>
            <p>Understand shared stress patterns without exposing anyone.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;

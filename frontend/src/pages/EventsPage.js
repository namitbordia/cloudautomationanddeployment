import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import TaskList from "../components/TaskList";
import { useWellness } from "../state/WellnessContext";

function EventsPage() {
  const { dashboard, createEvent, toggleEvent, loading } = useWellness();
  const [formState, setFormState] = useState({
    title: "",
    type: "assignment",
    dueDate: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const created = await createEvent(formState);
    if (created) {
      setFormState({
        title: "",
        type: "assignment",
        dueDate: "",
      });
    }
  }

  return (
    <div className="pageStack">
      <SectionHeader
        eyebrow="Events"
        title="Track exams and assignments"
        description="Keep an eye on workload buildup so check-ins can reflect context, not just emotion."
      />

      <section className="twoColumn">
        <form className="panelCard" onSubmit={handleSubmit}>
          <label className="fieldLabel" htmlFor="event-title">
            Event title
          </label>
          <input
            id="event-title"
            value={formState.title}
            onChange={(event) => setFormState({ ...formState, title: event.target.value })}
            placeholder="Linear Algebra quiz"
            required
          />

          <label className="fieldLabel" htmlFor="event-type">
            Event type
          </label>
          <select
            id="event-type"
            value={formState.type}
            onChange={(event) => setFormState({ ...formState, type: event.target.value })}
          >
            <option value="assignment">Assignment</option>
            <option value="exam">Exam</option>
          </select>

          <label className="fieldLabel" htmlFor="event-date">
            Due date
          </label>
          <input
            id="event-date"
            type="date"
            value={formState.dueDate}
            onChange={(event) => setFormState({ ...formState, dueDate: event.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving event..." : "Add event"}
          </button>
        </form>

        <section className="panelCard">
          <h3>Upcoming schedule</h3>
          <TaskList tasks={dashboard?.tasks || []} onToggle={toggleEvent} />
        </section>
      </section>
    </div>
  );
}

export default EventsPage;

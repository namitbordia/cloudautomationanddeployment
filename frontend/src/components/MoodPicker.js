const moodOptions = [
  { value: "happy", label: "Happy", accent: "sun" },
  { value: "neutral", label: "Neutral", accent: "sand" },
  { value: "stressed", label: "Stressed", accent: "coral" },
  { value: "sad", label: "Sad", accent: "mist" },
];

function MoodPicker({ value, onChange }) {
  return (
    <div className="moodGrid">
      {moodOptions.map((mood) => (
        <button
          key={mood.value}
          type="button"
          className={value === mood.value ? `moodChip ${mood.accent} active` : `moodChip ${mood.accent}`}
          onClick={() => onChange(mood.value)}
        >
          <span>{mood.label}</span>
          <small>{mood.value}</small>
        </button>
      ))}
    </div>
  );
}

export default MoodPicker;

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <header className="sectionHeader">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export default SectionHeader;

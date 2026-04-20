import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { useWellness } from "../state/WellnessContext";

function GroupsPage() {
  const {
    groups,
    groupMessages,
    refreshGroups,
    refreshGroupMessages,
    createInterestGroup,
    joinInterestGroup,
    postGroupMessage,
    loading,
  } = useWellness();
  const [interestFilter, setInterestFilter] = useState("");
  const [activeGroupId, setActiveGroupId] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    interest: "",
    description: "",
  });
  const [messageDraft, setMessageDraft] = useState("");

  useEffect(() => {
    refreshGroups();
  }, []);

  useEffect(() => {
    if (!activeGroupId) {
      return undefined;
    }

    const timer = setInterval(() => {
      refreshGroupMessages(activeGroupId);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeGroupId]);

  async function handleCreateGroup(event) {
    event.preventDefault();
    const created = await createInterestGroup(formState);

    if (created) {
      setFormState({
        name: "",
        interest: "",
        description: "",
      });
    }
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await refreshGroups(interestFilter);
  }

  async function handleOpenMessages(groupId) {
    setActiveGroupId(groupId);
    await refreshGroupMessages(groupId);
  }

  async function handleMessageSubmit(event) {
    event.preventDefault();

    if (!activeGroupId) {
      return;
    }

    const sent = await postGroupMessage(activeGroupId, messageDraft);

    if (sent) {
      setMessageDraft("");
    }
  }

  const activeGroup = groups.find((group) => group._id === activeGroupId);
  const activeMessages = activeGroupId ? groupMessages[activeGroupId] || [] : [];

  return (
    <div className="pageStack">
      <SectionHeader
        eyebrow="Groups"
        title="Find people with the same interests"
        description="Create your own anonymous student group, explore communities by interest, and join the ones that fit you."
      />

      <section className="twoColumn">
        <form className="panelCard" onSubmit={handleCreateGroup}>
          <h3>Create your own group</h3>
          <label className="fieldLabel" htmlFor="group-name">
            Group name
          </label>
          <input
            id="group-name"
            value={formState.name}
            onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            placeholder="Night Study Circle"
            required
          />

          <label className="fieldLabel" htmlFor="group-interest">
            Interest
          </label>
          <input
            id="group-interest"
            value={formState.interest}
            onChange={(event) => setFormState({ ...formState, interest: event.target.value })}
            placeholder="coding, music, exam prep, fitness"
            required
          />

          <label className="fieldLabel" htmlFor="group-description">
            Description
          </label>
          <textarea
            id="group-description"
            rows="5"
            value={formState.description}
            onChange={(event) => setFormState({ ...formState, description: event.target.value })}
            placeholder="What kind of students should join this group?"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create group"}
          </button>
        </form>

        <section className="panelCard">
          <h3>Browse by interest</h3>
          <form className="groupFilterRow" onSubmit={handleFilterSubmit}>
            <input
              value={interestFilter}
              onChange={(event) => setInterestFilter(event.target.value)}
              placeholder="Search by interest"
            />
            <button type="submit" disabled={loading}>
              Filter
            </button>
          </form>
          <button
            type="button"
            className="ghostAction"
            onClick={() => {
              setInterestFilter("");
              refreshGroups("");
            }}
          >
            Show all groups
          </button>
        </section>
      </section>

      <section className="panelCard">
        <h3>Open groups</h3>
        {groups.length ? (
          <div className="groupGrid">
            {groups.map((group) => (
              <article key={group._id} className="groupCard">
                <div className="groupCardTop">
                  <div>
                    <span className="groupTag">{group.interest}</span>
                    <h4>{group.name}</h4>
                  </div>
                  <span className="memberBadge">{group.memberCount} members</span>
                </div>

                <p className="muted">{group.description || "No description added yet."}</p>
                <p className="muted">Created by {group.createdBy?.nickname || "Anonymous student"}</p>

                <div className="groupMembers">
                  {group.members.slice(0, 5).map((member) => (
                    <span key={member.id} className="memberPill">
                      {member.nickname}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={loading || group.isJoined}
                  onClick={() => joinInterestGroup(group._id, interestFilter)}
                >
                  {group.isJoined ? "Joined" : "Join group"}
                </button>

                {group.isJoined && (
                  <button
                    type="button"
                    className="ghostAction"
                    onClick={() => handleOpenMessages(group._id)}
                  >
                    {activeGroupId === group._id ? "Viewing messages" : "Open messages"}
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">No groups yet for this interest. Create one and be the first member.</p>
        )}
      </section>

      {activeGroup && (
        <section className="panelCard">
          <div className="groupChatHeader">
            <div>
              <span className="groupTag">{activeGroup.interest}</span>
              <h3>{activeGroup.name} messages</h3>
            </div>
            <span className="memberBadge">{activeGroup.memberCount} members</span>
          </div>

          <div className="messageFeed">
            {activeMessages.length ? (
              activeMessages.map((item) => (
                <article key={item._id} className="messageBubble">
                  <strong>{item.author.nickname}</strong>
                  <p>{item.message}</p>
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </article>
              ))
            ) : (
              <p className="muted">No messages yet. Start the conversation for this group.</p>
            )}
          </div>

          <form className="messageComposer" onSubmit={handleMessageSubmit}>
            <textarea
              rows="4"
              value={messageDraft}
              onChange={(event) => setMessageDraft(event.target.value)}
              placeholder="Type your message to the group..."
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default GroupsPage;

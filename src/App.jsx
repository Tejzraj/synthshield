import { useState, useEffect } from "react";

export default function App() {
  const [personaType, setPersonaType] = useState("Student");
  const [epsilon, setEpsilon] = useState(1.0);

  const [loading, setLoading] = useState(false);
  const [currentLayer, setCurrentLayer] = useState("");

  const [persona, setPersona] = useState(null);
  const [dataTank, setDataTank] = useState(null);

  const [activeTab, setActiveTab] = useState("emails");

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("synthshield_data");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.persona) setPersona(data.persona);
        if (data.dataTank) setDataTank(data.dataTank);
        if (data.epsilon) setEpsilon(data.epsilon);
      }
    } catch (e) {
      console.error("Failed to load from sessionStorage:", e);
    }
  }, []);

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    if (persona || dataTank) {
      const data = { persona, dataTank, epsilon };
      sessionStorage.setItem("synthshield_data", JSON.stringify(data));
    }
  }, [persona, dataTank, epsilon]);

  // DP Simulation
  const applyDifferentialPrivacy = (value) => {
    const sensitivity = 10;
    const noisyValue =
      value + (Math.random() - 0.5) * (sensitivity / epsilon);
    return Math.round(noisyValue);
  };

  // Local Data Generation
  const generatePersona = () => {
    const studentNames = [
      "Arjun Kumar",
      "Priya Sharma",
      "Rahul Patel",
      "Neha Gupta",
      "Vikram Singh",
    ];
    const professionalNames = [
      "Amit Desai",
      "Sneha Reddy",
      "Rohan Mishra",
      "Isha Kapoor",
      "Dev Chopra",
    ];
    const travelerNames = [
      "Sameer Khan",
      "Maya Joshi",
      "Aditya Verma",
      "Zara Ahmed",
      "Nikhil Bansal",
    ];

    const studentOccupations = [
      "Engineering Student",
      "Arts Student",
      "MBA Student",
      "Research Scholar",
    ];
    const professionalOccupations = [
      "Software Engineer",
      "Product Manager",
      "UX Designer",
      "Data Analyst",
    ];
    const travelerOccupations = [
      "Freelancer",
      "Travel Blogger",
      "Remote Worker",
      "Consultant",
    ];

    const studentLocations = [
      "Bengaluru, India",
      "Mumbai, India",
      "Delhi, India",
      "Hyderabad, India",
      "Mysuru, India",
    ];
    const professionalLocations = [
      "San Francisco, USA",
      "New York, USA",
      "London, UK",
      "Bengaluru, India",
      "Singapore",
    ];
    const travelerLocations = [
      "Bangkok, Thailand",
      "Barcelona, Spain",
      "Tokyo, Japan",
      "Dubai, UAE",
      "Amsterdam, Netherlands",
    ];

    const studentApps = ["YouTube", "WhatsApp", "Notion", "Spotify", "Chrome"];
    const professionalApps = [
      "Slack",
      "Gmail",
      "Jira",
      "LinkedIn",
      "Zoom",
    ];
    const travelerApps = ["Maps", "Airbnb", "Uber", "Instagram", "Booking.com"];

    let names, occupations, locations, apps;
    if (personaType === "Student") {
      names = studentNames;
      occupations = studentOccupations;
      locations = studentLocations;
      apps = studentApps;
    } else if (personaType === "Professional") {
      names = professionalNames;
      occupations = professionalOccupations;
      locations = professionalLocations;
      apps = professionalApps;
    } else {
      names = travelerNames;
      occupations = travelerOccupations;
      locations = travelerLocations;
      apps = travelerApps;
    }

    const name = names[Math.floor(Math.random() * names.length)];
    const age =
      personaType === "Student"
        ? 18 + Math.floor(Math.random() * 7)
        : personaType === "Professional"
        ? 25 + Math.floor(Math.random() * 15)
        : 22 + Math.floor(Math.random() * 20);
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const noisyUsage = applyDifferentialPrivacy(75);
    const topApps = apps.slice(0, 4);
    const peakHours =
      personaType === "Student"
        ? "10pm - 1am"
        : personaType === "Professional"
        ? "9am - 5pm"
        : "Random";
    const privacyScore = (0.7 + Math.random() * 0.3).toFixed(2);
    const behaviorTags =
      personaType === "Student"
        ? ["Late-night user", "Social apps", "Content creator"]
        : personaType === "Professional"
        ? ["High productivity", "Communication focus", "Goal-oriented"]
        : ["Flexible schedule", "Exploration", "Adventure seeker"];

    return {
      name,
      age,
      occupation,
      location,
      deviceUsage: `${noisyUsage}%`,
      topApps,
      peakHours,
      privacyScore,
      behaviorTags,
    };
  };

  const generateDataTank = (personaData) => {
    const studentEmails = [
      {
        subject: "Assignment Submission Deadline",
        sender: "prof@university.edu",
        type: "Work",
      },
      {
        subject: "Social gathering this weekend?",
        sender: "friend@gmail.com",
        type: "Personal",
      },
      {
        subject: "Special offer on courses",
        sender: "deals@edtech.com",
        type: "Promo",
      },
    ];

    const professionalEmails = [
      {
        subject: "Project Review Meeting Tomorrow",
        sender: "manager@company.com",
        type: "Work",
      },
      {
        subject: "Coffee catchup?",
        sender: "colleague@company.com",
        type: "Personal",
      },
      {
        subject: "New course available",
        sender: "learning@platform.com",
        type: "Promo",
      },
    ];

    const travelerEmails = [
      {
        subject: "Your flight booking confirmation",
        sender: "bookings@airline.com",
        type: "Work",
      },
      {
        subject: "Meet up at the hostel",
        sender: "travelmate@gmail.com",
        type: "Personal",
      },
      {
        subject: "Deals on vacation packages",
        sender: "deals@travel.com",
        type: "Promo",
      },
    ];

    const studentCalendar = [
      { title: "Exam - Data Structures", time: "Tue 10:00 AM", type: "Work" },
      { title: "Movie night with friends", time: "Fri 8:00 PM", type: "Personal" },
      {
        title: "Club meeting",
        time: "Wed 4:00 PM",
        type: "Personal",
      },
    ];

    const professionalCalendar = [
      { title: "Standup Meeting", time: "Mon 9:30 AM", type: "Work" },
      { title: "1-on-1 with Manager", time: "Wed 2:00 PM", type: "Work" },
      { title: "Team lunch", time: "Thu 12:30 PM", type: "Personal" },
    ];

    const travelerCalendar = [
      { title: "Check-in at hotel", time: "Today 3:00 PM", type: "Work" },
      { title: "Explore local market", time: "Tomorrow 10:00 AM", type: "Personal" },
      { title: "Dinner reservation", time: "Sat 7:00 PM", type: "Personal" },
    ];

    const studentAppLogs = [
      {
        app: "YouTube",
        activity: "Watched tutorial video",
        time: "9:45 AM",
      },
      { app: "WhatsApp", activity: "Group chat", time: "2:15 PM" },
      { app: "Spotify", activity: "Listened to playlist", time: "6:30 PM" },
      { app: "Notion", activity: "Updated notes", time: "11:20 PM" },
    ];

    const professionalAppLogs = [
      { app: "Slack", activity: "Team messaging", time: "9:00 AM" },
      { app: "Jira", activity: "Updated task status", time: "10:30 AM" },
      { app: "Gmail", activity: "Checked emails", time: "2:00 PM" },
      { app: "LinkedIn", activity: "Browsed feed", time: "5:45 PM" },
    ];

    const travelerAppLogs = [
      { app: "Maps", activity: "Planned route", time: "8:00 AM" },
      { app: "Instagram", activity: "Shared photos", time: "1:15 PM" },
      { app: "Booking.com", activity: "Searched hotels", time: "4:30 PM" },
      { app: "Uber", activity: "Booked a ride", time: "6:45 PM" },
    ];

    let emails, calendar, appLogs;
    if (personaType === "Student") {
      emails = studentEmails;
      calendar = studentCalendar;
      appLogs = studentAppLogs;
    } else if (personaType === "Professional") {
      emails = professionalEmails;
      calendar = professionalCalendar;
      appLogs = professionalAppLogs;
    } else {
      emails = travelerEmails;
      calendar = travelerCalendar;
      appLogs = travelerAppLogs;
    }

    return { emails, calendar, appLogs };
  };

  // Run Pipeline
  const runPipeline = async () => {
    try {
      setLoading(true);

      // Layer 1
      setCurrentLayer("Layer 01 — Differential Privacy Analysis");
      await new Promise((r) => setTimeout(r, 1200));

      // Layer 2
      setCurrentLayer("Layer 02 — Persona Generation");
      const personaData = generatePersona();
      setPersona(personaData);
      await new Promise((r) => setTimeout(r, 1000));

      // Layer 3
      setCurrentLayer("Layer 03 — Data Tank Population");
      const tankData = generateDataTank(personaData);
      setDataTank(tankData);
      await new Promise((r) => setTimeout(r, 800));

      setCurrentLayer("Pipeline Complete ✓");
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      alert("Pipeline error: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Download JSON
  const downloadJSON = () => {
    const data = {
      persona,
      dataTank,
      epsilon,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "synthshield-output.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "32px" }}>SynthShield</h1>
          <p style={{ opacity: 0.7, margin: "4px 0 0 0", fontSize: "14px" }}>
            Privacy-Preserving Synthetic User Generation
          </p>
        </div>
        <p style={{ opacity: 0.6, fontSize: "14px", margin: 0 }}>
          ✓ Offline · No API Key Required
        </p>
      </div>

      {/* Controls */}
      <div style={cardStyle}>
        <h2 style={{ margin: "0 0 20px 0" }}>Configuration</h2>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Persona Type
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            {["Student", "Professional", "Traveler"].map((type) => (
              <button
                key={type}
                onClick={() => setPersonaType(type)}
                style={{
                  ...buttonStyle,
                  background: personaType === type ? "#2563eb" : "#1e293b",
                  flex: 1,
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Differential Privacy ε:{" "}
            <span style={{ color: "#2563eb" }}>{epsilon.toFixed(1)}</span>
          </label>

          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={epsilon}
            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "5px",
              background: "#1e293b",
              outline: "none",
              WebkitAppearance: "none",
            }}
          />
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginTop: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>← Stronger Privacy</span>
            <span>Higher Utility →</span>
          </div>
        </div>

        <button
          onClick={runPipeline}
          disabled={loading}
          style={{
            ...buttonStyle,
            width: "100%",
            background: loading ? "#1e293b" : "#16a34a",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            padding: "12px",
          }}
        >
          {loading ? "Running Pipeline..." : "▶ Run Pipeline"}
        </button>
      </div>

      {/* Pipeline */}
      {loading && (
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 20px 0" }}>Pipeline Execution</h2>

          <div style={layerStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  animation: "spin 1s linear infinite",
                }}
              />
              <span style={{ fontSize: "16px" }}>{currentLayer}</span>
            </div>
          </div>

          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Persona Card */}
      {persona && (
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 20px 0" }}>Generated Persona</h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #1e40af)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
                color: "white",
                flexShrink: 0,
              }}
            >
              {persona.name?.[0] || "?"}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
                {persona.name || "Unknown"}
              </h3>

              <p style={{ margin: "4px 0", color: "#cbd5e1" }}>
                {persona.age || "?"} · {persona.occupation || "?"}
              </p>

              <p style={{ margin: "4px 0", color: "#cbd5e1" }}>
                📍 {persona.location || "?"}
              </p>

              <p style={{ margin: "4px 0", color: "#cbd5e1" }}>
                ⏰ Peak: {persona.peakHours || "?"}
              </p>

              <p style={{ margin: "4px 0", color: "#cbd5e1" }}>
                🔐 Privacy Score: {persona.privacyScore || "?"}
              </p>
            </div>
          </div>

          {/* Tags */}
          {persona.behaviorTags && persona.behaviorTags.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
                Behavior Tags
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {persona.behaviorTags.map((tag, idx) => (
                  <span key={idx} style={tagStyle}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apps */}
          {persona.topApps && persona.topApps.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
                Top Apps
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {persona.topApps.map((app, idx) => (
                  <span key={idx} style={appStyle}>
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Tank */}
      {dataTank && (
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0 }}>Data Tank</h2>

            <button onClick={downloadJSON} style={buttonStyle}>
              ⬇ Download JSON
            </button>
          </div>

          {/* Tabs */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            {["emails", "calendar", "appLogs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...buttonStyle,
                  background: activeTab === tab ? "#2563eb" : "#1e293b",
                  flex: 1,
                }}
              >
                {tab === "appLogs" ? "App Logs" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Emails */}
          {activeTab === "emails" &&
            dataTank.emails?.map((email, idx) => (
              <div key={idx} style={itemStyle}>
                <h4 style={{ margin: "0 0 4px 0" }}>{email.subject || "?"}</h4>
                <p style={{ margin: "4px 0", color: "#cbd5e1", fontSize: "14px" }}>
                  {email.sender || "?"}
                </p>

                <span style={badgeStyle(email.type)}>{email.type}</span>
              </div>
            ))}

          {/* Calendar */}
          {activeTab === "calendar" &&
            dataTank.calendar?.map((event, idx) => (
              <div key={idx} style={itemStyle}>
                <h4 style={{ margin: "0 0 4px 0" }}>{event.title || "?"}</h4>
                <p style={{ margin: "4px 0", color: "#cbd5e1", fontSize: "14px" }}>
                  {event.time || "?"}
                </p>

                <span style={badgeStyle(event.type)}>{event.type}</span>
              </div>
            ))}

          {/* App Logs */}
          {activeTab === "appLogs" &&
            dataTank.appLogs?.map((log, idx) => (
              <div key={idx} style={itemStyle}>
                <h4 style={{ margin: "0 0 4px 0" }}>{log.app || "?"}</h4>
                <p style={{ margin: "4px 0", color: "#cbd5e1", fontSize: "14px" }}>
                  {log.activity || "?"}
                </p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: "#94a3b8",
                    fontSize: "12px",
                  }}
                >
                  {log.time || "?"}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// Styles
const cardStyle = {
  background: "#111827",
  padding: "25px",
  borderRadius: "18px",
  marginBottom: "25px",
};

const buttonStyle = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  color: "white",
  background: "#1e293b",
  fontWeight: "bold",
};

const layerStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "15px",
};

const tagStyle = {
  background: "#334155",
  padding: "8px 14px",
  borderRadius: "999px",
  display: "inline-block",
  fontSize: "12px",
};

const appStyle = {
  background: "#2563eb",
  padding: "8px 14px",
  borderRadius: "999px",
  display: "inline-block",
  fontSize: "12px",
};

const itemStyle = {
  background: "#1e293b",
  padding: "18px",
  borderRadius: "14px",
  marginBottom: "15px",
};

const badgeStyle = (type) => ({
  background:
    type === "Work"
      ? "#2563eb"
      : type === "Personal"
      ? "#16a34a"
      : "#9333ea",

  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  display: "inline-block",
  color: "white",
});

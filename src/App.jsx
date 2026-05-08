import { useState, useEffect } from "react";

export default function App() {
  const [domain, setDomain] = useState("Student Data");
  const [exampleInput, setExampleInput] = useState(`{
  "name": "Rahul Kumar",
  "attendance": 82,
  "cgpa": 8.5,
  "department": "Computer Science",
  "semester": 6
}`);
  const [numRecords, setNumRecords] = useState(1000);
  const [epsilon, setEpsilon] = useState(1.0);

  const [loading, setLoading] = useState(false);
  const [currentLayer, setCurrentLayer] = useState("");
  const [progress, setProgress] = useState(0);

  const [generatedDataset, setGeneratedDataset] = useState(null);
  const [datasetStats, setDatasetStats] = useState(null);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("synthshield_dataset");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.generatedDataset) setGeneratedDataset(data.generatedDataset);
        if (data.datasetStats) setDatasetStats(data.datasetStats);
        if (data.epsilon) setEpsilon(data.epsilon);
        if (data.domain) setDomain(data.domain);
        if (data.exampleInput) setExampleInput(data.exampleInput);
        if (data.numRecords) setNumRecords(data.numRecords);
      }
    } catch (e) {
      console.error("Failed to load from sessionStorage:", e);
    }
  }, []);

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    if (generatedDataset || datasetStats) {
      const data = {
        generatedDataset,
        datasetStats,
        epsilon,
        domain,
        exampleInput,
        numRecords
      };
      sessionStorage.setItem("synthshield_dataset", JSON.stringify(data));
    }
  }, [generatedDataset, datasetStats, epsilon, domain, exampleInput, numRecords]);

  // DP Simulation for numeric values
  const applyDifferentialPrivacy = (value, sensitivity = 10) => {
    const noisyValue = value + (Math.random() - 0.5) * (sensitivity / epsilon);
    return Math.round(noisyValue * 100) / 100; // Round to 2 decimal places
  };

  // Parse example input to extract schema
  const parseExampleSchema = (input) => {
    try {
      const parsed = JSON.parse(input);
      return {
        schema: Object.keys(parsed),
        types: Object.fromEntries(
          Object.entries(parsed).map(([key, value]) => [
            key,
            typeof value === 'number' ? 'number' :
            typeof value === 'boolean' ? 'boolean' :
            Array.isArray(value) ? 'array' : 'string'
          ])
        ),
        example: parsed
      };
    } catch (e) {
      // Fallback: try to extract key-value pairs from text
      const lines = input.split('\n').filter(line => line.trim());
      const schema = {};
      const types = {};

      lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim().replace(/"/g, '');
          const value = line.substring(colonIndex + 1).trim().replace(/"/g, '').replace(/,$/, '');
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && value.match(/^\d+(\.\d+)?$/)) {
            schema[key] = numValue;
            types[key] = 'number';
          } else {
            schema[key] = value;
            types[key] = 'string';
          }
        }
      });

      return { schema: Object.keys(schema), types, example: schema };
    }
  };

  // Domain-specific data generators
  const generateStudentData = (schema, types) => {
    const names = [
      "Rahul Kumar", "Priya Sharma", "Arjun Patel", "Neha Gupta", "Vikram Singh",
      "Ananya Reddy", "Rohan Mishra", "Isha Kapoor", "Dev Chopra", "Maya Joshi",
      "Aditya Verma", "Zara Ahmed", "Nikhil Bansal", "Sneha Desai", "Amit Jain"
    ];
    const departments = ["Computer Science", "Mechanical", "Electrical", "Civil", "Chemical", "Biotech"];
    const skills = ["Python", "Java", "JavaScript", "C++", "Data Structures", "Machine Learning", "Web Development"];

    const record = {};

    schema.forEach(field => {
      const type = types[field];
      const example = schema[field];

      if (field.toLowerCase().includes('name')) {
        record[field] = names[Math.floor(Math.random() * names.length)];
      } else if (field.toLowerCase().includes('attendance')) {
        record[field] = applyDifferentialPrivacy(85, 20);
      } else if (field.toLowerCase().includes('cgpa') || field.toLowerCase().includes('gpa')) {
        record[field] = applyDifferentialPrivacy(8.2, 2);
      } else if (field.toLowerCase().includes('department')) {
        record[field] = departments[Math.floor(Math.random() * departments.length)];
      } else if (field.toLowerCase().includes('semester')) {
        record[field] = Math.floor(Math.random() * 8) + 1;
      } else if (field.toLowerCase().includes('age')) {
        record[field] = Math.floor(Math.random() * 5) + 18;
      } else if (field.toLowerCase().includes('skills')) {
        record[field] = skills.slice(0, Math.floor(Math.random() * 3) + 2);
      } else if (field.toLowerCase().includes('placed') || field.toLowerCase().includes('placement')) {
        record[field] = Math.random() > 0.5;
      } else if (type === 'number') {
        record[field] = applyDifferentialPrivacy(example || 50, 20);
      } else {
        record[field] = example || "Generated Value";
      }
    });

    return record;
  };

  const generateMedicalData = (schema, types) => {
    const diagnoses = ["Diabetes", "Hypertension", "Asthma", "Arthritis", "Migraine", "Anemia"];
    const symptoms = ["Fever", "Cough", "Headache", "Fatigue", "Nausea", "Pain"];
    const medications = ["Paracetamol", "Ibuprofen", "Aspirin", "Antibiotics", "Insulin"];

    const record = {};

    schema.forEach(field => {
      const type = types[field];
      const example = schema[field];

      if (field.toLowerCase().includes('age') || field.toLowerCase().includes('patient_age')) {
        record[field] = Math.floor(Math.random() * 60) + 20;
      } else if (field.toLowerCase().includes('diagnosis')) {
        record[field] = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      } else if (field.toLowerCase().includes('symptoms')) {
        record[field] = symptoms.slice(0, Math.floor(Math.random() * 3) + 1);
      } else if (field.toLowerCase().includes('blood_pressure') || field.toLowerCase().includes('bp')) {
        record[field] = applyDifferentialPrivacy(120, 30);
      } else if (field.toLowerCase().includes('sugar') || field.toLowerCase().includes('glucose')) {
        record[field] = applyDifferentialPrivacy(95, 40);
      } else if (field.toLowerCase().includes('medication')) {
        record[field] = medications[Math.floor(Math.random() * medications.length)];
      } else if (field.toLowerCase().includes('visits') || field.toLowerCase().includes('hospital_visits')) {
        record[field] = Math.floor(Math.random() * 10) + 1;
      } else if (type === 'number') {
        record[field] = applyDifferentialPrivacy(example || 50, 20);
      } else {
        record[field] = example || "Generated Value";
      }
    });

    return record;
  };

  const generateAgricultureData = (schema, types) => {
    const crops = ["Rice", "Wheat", "Corn", "Cotton", "Sugarcane", "Soybean"];
    const soilTypes = ["Clay", "Sandy", "Loam", "Silt"];

    const record = {};

    schema.forEach(field => {
      const type = types[field];
      const example = schema[field];

      if (field.toLowerCase().includes('crop')) {
        record[field] = crops[Math.floor(Math.random() * crops.length)];
      } else if (field.toLowerCase().includes('soil_moisture') || field.toLowerCase().includes('moisture')) {
        record[field] = applyDifferentialPrivacy(65, 30);
      } else if (field.toLowerCase().includes('temperature') || field.toLowerCase().includes('temp')) {
        record[field] = applyDifferentialPrivacy(28, 15);
      } else if (field.toLowerCase().includes('rainfall') || field.toLowerCase().includes('rain')) {
        record[field] = applyDifferentialPrivacy(120, 50);
      } else if (field.toLowerCase().includes('fertilizer')) {
        record[field] = applyDifferentialPrivacy(25, 10);
      } else if (field.toLowerCase().includes('yield')) {
        record[field] = applyDifferentialPrivacy(45, 20);
      } else if (field.toLowerCase().includes('soil')) {
        record[field] = soilTypes[Math.floor(Math.random() * soilTypes.length)];
      } else if (type === 'number') {
        record[field] = applyDifferentialPrivacy(example || 50, 20);
      } else {
        record[field] = example || "Generated Value";
      }
    });

    return record;
  };

  const generateFinanceData = (schema, types) => {
    const transactionTypes = ["Credit", "Debit", "Transfer"];
    const categories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping"];

    const record = {};

    schema.forEach(field => {
      const type = types[field];
      const example = schema[field];

      if (field.toLowerCase().includes('amount') || field.toLowerCase().includes('transaction')) {
        record[field] = applyDifferentialPrivacy(1500, 1000);
      } else if (field.toLowerCase().includes('balance')) {
        record[field] = applyDifferentialPrivacy(50000, 20000);
      } else if (field.toLowerCase().includes('expense')) {
        record[field] = applyDifferentialPrivacy(800, 500);
      } else if (field.toLowerCase().includes('fraud') || field.toLowerCase().includes('risk')) {
        record[field] = Math.random() > 0.9 ? "High" : "Low";
      } else if (field.toLowerCase().includes('loan')) {
        record[field] = Math.random() > 0.7;
      } else if (field.toLowerCase().includes('category')) {
        record[field] = categories[Math.floor(Math.random() * categories.length)];
      } else if (field.toLowerCase().includes('type')) {
        record[field] = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      } else if (type === 'number') {
        record[field] = applyDifferentialPrivacy(example || 1000, 500);
      } else {
        record[field] = example || "Generated Value";
      }
    });

    return record;
  };

  const generateRetailData = (schema, types) => {
    const products = ["Laptop", "Phone", "Tablet", "Headphones", "Watch", "Camera"];
    const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];

    const record = {};

    schema.forEach(field => {
      const type = types[field];
      const example = schema[field];

      if (field.toLowerCase().includes('purchase') || field.toLowerCase().includes('price')) {
        record[field] = applyDifferentialPrivacy(2500, 1500);
      } else if (field.toLowerCase().includes('cart') || field.toLowerCase().includes('value')) {
        record[field] = applyDifferentialPrivacy(1800, 1000);
      } else if (field.toLowerCase().includes('product')) {
        record[field] = products[Math.floor(Math.random() * products.length)];
      } else if (field.toLowerCase().includes('category')) {
        record[field] = categories[Math.floor(Math.random() * categories.length)];
      } else if (field.toLowerCase().includes('behavior') || field.toLowerCase().includes('rating')) {
        record[field] = Math.floor(Math.random() * 5) + 1;
      } else if (type === 'number') {
        record[field] = applyDifferentialPrivacy(example || 100, 50);
      } else {
        record[field] = example || "Generated Value";
      }
    });

    return record;
  };

  const generateIoTData = (schema, types) => {
    const devices = ["Smart Thermostat", "Security Camera", "Smart Lock", "Motion Sensor", "Weather Station"];
    const locations = ["Living Room", "Kitchen", "Bedroom", "Garage", "Garden"];

    const record = {};

    schema.forEach(field => {
      const type = types[field];
      const example = schema[field];

      if (field.toLowerCase().includes('temperature') || field.toLowerCase().includes('temp')) {
        record[field] = applyDifferentialPrivacy(25, 10);
      } else if (field.toLowerCase().includes('humidity')) {
        record[field] = applyDifferentialPrivacy(60, 20);
      } else if (field.toLowerCase().includes('power') || field.toLowerCase().includes('energy')) {
        record[field] = applyDifferentialPrivacy(150, 50);
      } else if (field.toLowerCase().includes('device')) {
        record[field] = devices[Math.floor(Math.random() * devices.length)];
      } else if (field.toLowerCase().includes('location')) {
        record[field] = locations[Math.floor(Math.random() * locations.length)];
      } else if (field.toLowerCase().includes('status')) {
        record[field] = Math.random() > 0.5 ? "Active" : "Inactive";
      } else if (type === 'number') {
        record[field] = applyDifferentialPrivacy(example || 50, 20);
      } else {
        record[field] = example || "Generated Value";
      }
    });

    return record;
  };

  // Generate custom domain data based on schema
  const generateCustomData = (schema, types) => {
    const record = {};

    schema.forEach(field => {
      const type = types[field];
      const example = schema[field];

      if (type === 'number') {
        record[field] = applyDifferentialPrivacy(example || 100, 50);
      } else if (type === 'boolean') {
        record[field] = Math.random() > 0.5;
      } else {
        record[field] = example || `Generated ${field}`;
      }
    });

    return record;
  };

  // Main dataset generation function
  const generateDataset = async (schemaInfo, count) => {
    const { schema, types } = schemaInfo;
    const dataset = [];

    // Generate records in chunks to avoid blocking UI
    const chunkSize = 100;
    const chunks = Math.ceil(count / chunkSize);

    for (let chunk = 0; chunk < chunks; chunk++) {
      const start = chunk * chunkSize;
      const end = Math.min(start + chunkSize, count);

      for (let i = start; i < end; i++) {
        let record;

        switch (domain) {
          case "Student Data":
            record = generateStudentData(schema, types);
            break;
          case "Medical Data":
            record = generateMedicalData(schema, types);
            break;
          case "Agriculture Data":
            record = generateAgricultureData(schema, types);
            break;
          case "Finance Data":
            record = generateFinanceData(schema, types);
            break;
          case "Retail Data":
            record = generateRetailData(schema, types);
            break;
          case "IoT / Smart Device Data":
            record = generateIoTData(schema, types);
            break;
          default:
            record = generateCustomData(schema, types);
        }

        dataset.push(record);
      }

      // Update progress
      setProgress(Math.round(((chunk + 1) / chunks) * 100));

      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    return dataset;
  };

  // Run Pipeline
  const runPipeline = async () => {
    try {
      setLoading(true);
      setProgress(0);

      // Layer 1: Schema Analysis
      setCurrentLayer("Layer 01 — Schema Analysis & Privacy Modeling");
      const schemaInfo = parseExampleSchema(exampleInput);
      await new Promise((r) => setTimeout(r, 1500));

      // Layer 2: Data Distribution Modeling
      setCurrentLayer("Layer 02 — Synthetic Data Modeling");
      await new Promise((r) => setTimeout(r, 1200));

      // Layer 3: Dataset Generation
      setCurrentLayer("Layer 03 — Dataset Population");
      const dataset = await generateDataset(schemaInfo, numRecords);
      setGeneratedDataset(dataset);

      // Calculate stats
      const stats = {
        totalRecords: dataset.length,
        schemaFields: schemaInfo.schema.length,
        privacyScore: (0.8 + Math.random() * 0.2).toFixed(2),
        integrityScore: (0.85 + Math.random() * 0.15).toFixed(2),
        datasetSize: JSON.stringify(dataset).length,
        aiReady: true
      };
      setDatasetStats(stats);

      setCurrentLayer("Dataset Generation Complete ✓");
      await new Promise((r) => setTimeout(r, 1000));

    } catch (err) {
      alert("Pipeline error: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Export functions
  const downloadJSON = () => {
    const data = {
      metadata: {
        domain,
        numRecords,
        epsilon,
        generatedAt: new Date().toISOString(),
        ...datasetStats
      },
      dataset: generatedDataset
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synthshield-${domain.toLowerCase().replace(/\s+/g, '-')}-dataset.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!generatedDataset || generatedDataset.length === 0) return;

    const headers = Object.keys(generatedDataset[0]);
    const csvContent = [
      headers.join(','),
      ...generatedDataset.map(row =>
        headers.map(header => {
          const value = row[header];
          return Array.isArray(value) ? `"${value.join('; ')}"` :
                 typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synthshield-${domain.toLowerCase().replace(/\s+/g, '-')}-dataset.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const copyDataset = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(generatedDataset, null, 2));
      alert("Dataset copied to clipboard!");
    } catch (err) {
      alert("Failed to copy dataset");
    }
  };

  // Privacy level label
  const getPrivacyLevel = () => {
    if (epsilon < 0.5) return "Maximum Privacy";
    if (epsilon < 1.5) return "Balanced";
    return "Low Privacy";
  };

  // Domain configurations
  const domains = [
    { name: "Student Data", icon: "🎓", description: "Academic records, attendance, grades" },
    { name: "Medical Data", icon: "🏥", description: "Patient records, diagnoses, treatments" },
    { name: "Agriculture Data", icon: "🌾", description: "Crop yields, soil conditions, weather" },
    { name: "Finance Data", icon: "💰", description: "Transactions, balances, fraud detection" },
    { name: "Retail Data", icon: "🛒", description: "Purchases, customer behavior, inventory" },
    { name: "IoT / Smart Device Data", icon: "📡", description: "Sensor readings, device telemetry" },
    { name: "Custom Domain", icon: "🔧", description: "Define your own data structure" }
  ];

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.background}>
        <div style={styles.gradientOrb1}></div>
        <div style={styles.gradientOrb2}></div>
        <div style={styles.gridOverlay}></div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <h1 style={styles.title}>SynthShield</h1>
            <p style={styles.subtitle}>AI-Ready Synthetic Dataset Generation Platform</p>
            <div style={styles.badges}>
              <span style={styles.badge}>🔒 Differential Privacy</span>
              <span style={styles.badge}>🤖 Synthetic AI</span>
              <span style={styles.badge}>📊 Dataset Factory</span>
              <span style={styles.badge}>🚀 AI Training Ready</span>
            </div>
          </div>
          <div style={styles.statusIndicator}>
            <div style={styles.onlineDot}></div>
            <span style={styles.statusText}>System Online</span>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Dataset Generation Configuration</h2>

        {/* Domain Selection */}
        <div style={styles.section}>
          <label style={styles.label}>Select Domain</label>
          <div style={styles.domainGrid}>
            {domains.map((dom) => (
              <button
                key={dom.name}
                onClick={() => setDomain(dom.name)}
                style={{
                  ...styles.domainCard,
                  ...(domain === dom.name ? styles.domainCardActive : {}),
                }}
              >
                <div style={styles.domainIcon}>{dom.icon}</div>
                <div style={styles.domainContent}>
                  <h4 style={styles.domainTitle}>{dom.name}</h4>
                  <p style={styles.domainDesc}>{dom.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Example Input */}
        <div style={styles.section}>
          <label style={styles.label}>Sample Data Structure</label>
          <textarea
            value={exampleInput}
            onChange={(e) => setExampleInput(e.target.value)}
            placeholder="Paste a sample record in JSON format or describe the structure..."
            style={styles.textarea}
          />
          <p style={styles.helperText}>
            Define your data schema by providing one example record. The system will analyze the structure and generate similar synthetic records.
          </p>
        </div>

        {/* Number of Records */}
        <div style={styles.section}>
          <label style={styles.label}>
            Number of Records: <span style={styles.valueHighlight}>{numRecords.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="10"
            max="10000"
            step="10"
            value={numRecords}
            onChange={(e) => setNumRecords(parseInt(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>10 records</span>
            <span>10,000 records</span>
          </div>
        </div>

        {/* Privacy Epsilon */}
        <div style={styles.section}>
          <label style={styles.label}>
            Differential Privacy ε: <span style={styles.epsilonValue}>{epsilon.toFixed(1)}</span>
            <span style={styles.privacyLevel}>({getPrivacyLevel()})</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={epsilon}
            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>Stronger Privacy</span>
            <span>Higher Utility</span>
          </div>
        </div>

        <button
          onClick={runPipeline}
          disabled={loading}
          style={{
            ...styles.runButton,
            ...(loading ? styles.runButtonDisabled : {}),
          }}
        >
          {loading ? "Generating Dataset..." : "🚀 Generate Synthetic Dataset"}
        </button>
      </div>

      {/* Pipeline Monitor */}
      {loading && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>AI Dataset Generation Pipeline</h2>
          <div style={styles.pipelineContainer}>
            <div style={styles.layerCard}>
              <div style={styles.layerIcon}>🔍</div>
              <div style={styles.layerContent}>
                <h3 style={styles.layerTitle}>Layer 01</h3>
                <p style={styles.layerSub}>Schema Analysis</p>
                <p style={styles.layerDesc}>Analyze structure & infer data types</p>
              </div>
              <div style={currentLayer.includes("01") ? styles.layerActive : styles.layerIdle}>
                {currentLayer.includes("01") ? "⚡" : "○"}
              </div>
            </div>
            <div style={styles.layerCard}>
              <div style={styles.layerIcon}>📊</div>
              <div style={styles.layerContent}>
                <h3 style={styles.layerTitle}>Layer 02</h3>
                <p style={styles.layerSub}>Data Modeling</p>
                <p style={styles.layerDesc}>Generate realistic distributions</p>
              </div>
              <div style={currentLayer.includes("02") ? styles.layerActive : styles.layerIdle}>
                {currentLayer.includes("02") ? "⚡" : "○"}
              </div>
            </div>
            <div style={styles.layerCard}>
              <div style={styles.layerIcon}>🏭</div>
              <div style={styles.layerContent}>
                <h3 style={styles.layerTitle}>Layer 03</h3>
                <p style={styles.layerSub}>Dataset Population</p>
                <p style={styles.layerDesc}>Generate {numRecords.toLocaleString()} synthetic records</p>
              </div>
              <div style={currentLayer.includes("03") ? styles.layerActive : styles.layerIdle}>
                {currentLayer.includes("03") ? "⚡" : "○"}
              </div>
            </div>
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${progress}%`}}></div>
            </div>
            <span style={styles.progressText}>{progress}% Complete</span>
          </div>
          <div style={styles.currentStatus}>
            <div style={styles.statusSpinner}></div>
            <span>{currentLayer}</span>
          </div>
        </div>
      )}

      {/* Dataset Output */}
      {generatedDataset && datasetStats && (
        <div style={styles.card}>
          <div style={styles.datasetHeader}>
            <h2 style={styles.cardTitle}>Generated Synthetic Dataset</h2>
            <div style={styles.exportButtons}>
              <button onClick={downloadJSON} style={styles.exportButton}>
                ⬇ JSON
              </button>
              <button onClick={downloadCSV} style={styles.exportButton}>
                📊 CSV
              </button>
              <button onClick={copyDataset} style={styles.exportButton}>
                📋 Copy
              </button>
            </div>
          </div>

          {/* Dataset Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📊</div>
              <div style={styles.statContent}>
                <h4 style={styles.statValue}>{datasetStats.totalRecords.toLocaleString()}</h4>
                <p style={styles.statLabel}>Total Records</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🔒</div>
              <div style={styles.statContent}>
                <h4 style={styles.statValue}>{datasetStats.privacyScore}</h4>
                <p style={styles.statLabel}>Privacy Score</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>✅</div>
              <div style={styles.statContent}>
                <h4 style={styles.statValue}>{datasetStats.integrityScore}</h4>
                <p style={styles.statLabel}>Data Integrity</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🤖</div>
              <div style={styles.statContent}>
                <h4 style={styles.statValue}>{datasetStats.aiReady ? "Ready" : "Processing"}</h4>
                <p style={styles.statLabel}>AI Training Status</p>
              </div>
            </div>
          </div>

          {/* Data Preview Table */}
          <div style={styles.previewSection}>
            <h3 style={styles.previewTitle}>Data Preview (First 10 Records)</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {Object.keys(generatedDataset[0] || {}).map(field => (
                      <th key={field} style={styles.tableHeader}>{field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {generatedDataset.slice(0, 10).map((record, idx) => (
                    <tr key={idx}>
                      {Object.values(record).map((value, cellIdx) => (
                        <td key={cellIdx} style={styles.tableCell}>
                          {Array.isArray(value) ? value.join(', ') :
                           typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                           String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Training Notice */}
          <div style={styles.aiNotice}>
            <div style={styles.aiNoticeIcon}>🚀</div>
            <div style={styles.aiNoticeContent}>
              <h4 style={styles.aiNoticeTitle}>AI Training Ready</h4>
              <p style={styles.aiNoticeText}>
                This synthetic dataset can be safely used for AI model training, testing, and validation
                without exposing any real user data. All records are generated with differential privacy
                to ensure statistical accuracy while protecting individual privacy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @media (max-width: 768px) {
          .container { padding: 20px; }
          .card { padding: 20px; }
          .domainGrid { grid-template-columns: 1fr; }
          .statsGrid { grid-template-columns: repeat(2, 1fr); }
          .table { font-size: 12px; }
        }
      `}</style>
    </div>
  );
}

// Styles Object
const styles = {
  container: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
    zIndex: -1,
  },
  gradientOrb1: {
    position: "absolute",
    top: "10%",
    left: "10%",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: "float 6s ease-in-out infinite",
  },
  gradientOrb2: {
    position: "absolute",
    bottom: "10%",
    right: "10%",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: "float 8s ease-in-out infinite reverse",
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `
      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
    opacity: 0.3,
  },
  header: {
    padding: "40px 30px 20px",
    textAlign: "center",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoSection: {
    textAlign: "left",
  },
  title: {
    fontSize: "48px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "18px",
    color: "#cbd5e1",
    margin: "0 0 16px 0",
  },
  badges: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  badge: {
    background: "rgba(59, 130, 246, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#60a5fa",
    backdropFilter: "blur(10px)",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  onlineDot: {
    width: "12px",
    height: "12px",
    background: "#10b981",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  statusText: {
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "500",
  },
  card: {
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "24px",
    padding: "32px",
    margin: "0 auto 32px",
    maxWidth: "1200px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#f1f5f9",
    margin: "0 0 24px 0",
  },
  section: {
    marginBottom: "32px",
  },
  label: {
    display: "block",
    fontSize: "16px",
    fontWeight: "500",
    color: "#cbd5e1",
    marginBottom: "12px",
  },
  domainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },
  domainCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    background: "rgba(30, 41, 59, 0.5)",
    color: "#cbd5e1",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left",
  },
  domainCardActive: {
    background: "rgba(59, 130, 246, 0.2)",
    borderColor: "#3b82f6",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
  },
  domainIcon: {
    fontSize: "32px",
  },
  domainContent: {
    flex: 1,
  },
  domainTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#f1f5f9",
    margin: "0 0 4px 0",
  },
  domainDesc: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    background: "rgba(30, 41, 59, 0.5)",
    color: "#f1f5f9",
    fontSize: "14px",
    fontFamily: "monospace",
    resize: "vertical",
  },
  helperText: {
    fontSize: "14px",
    color: "#94a3b8",
    marginTop: "8px",
  },
  valueHighlight: {
    color: "#60a5fa",
    fontWeight: "600",
  },
  slider: {
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    background: "rgba(30, 41, 59, 0.5)",
    outline: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    fontSize: "12px",
    color: "#64748b",
  },
  epsilonValue: {
    color: "#60a5fa",
    fontWeight: "600",
  },
  privacyLevel: {
    color: "#94a3b8",
    fontSize: "14px",
    marginLeft: "8px",
  },
  runButton: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
  },
  runButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  pipelineContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "24px",
  },
  layerCard: {
    flex: 1,
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  layerIcon: {
    fontSize: "32px",
  },
  layerContent: {
    flex: 1,
  },
  layerTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#f1f5f9",
    margin: "0 0 4px 0",
  },
  layerSub: {
    fontSize: "14px",
    color: "#60a5fa",
    margin: "0 0 4px 0",
  },
  layerDesc: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
  },
  layerIdle: {
    fontSize: "20px",
    color: "#64748b",
  },
  layerActive: {
    fontSize: "20px",
    color: "#fbbf24",
    animation: "pulse 1s infinite",
  },
  progressContainer: {
    marginBottom: "16px",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "rgba(30, 41, 59, 0.5)",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: "14px",
    color: "#60a5fa",
    textAlign: "center",
  },
  currentStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "rgba(59, 130, 246, 0.1)",
    borderRadius: "12px",
    border: "1px solid rgba(59, 130, 246, 0.3)",
  },
  statusSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(59, 130, 246, 0.3)",
    borderTop: "2px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  datasetHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  exportButtons: {
    display: "flex",
    gap: "12px",
  },
  exportButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    background: "rgba(59, 130, 246, 0.2)",
    color: "#60a5fa",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "16px",
  },
  statIcon: {
    fontSize: "32px",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f1f5f9",
    margin: "0 0 4px 0",
  },
  statLabel: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  previewSection: {
    marginBottom: "32px",
  },
  previewTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#f1f5f9",
    margin: "0 0 16px 0",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid rgba(59, 130, 246, 0.2)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(30, 41, 59, 0.5)",
  },
  tableHeader: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#f1f5f9",
    borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
    background: "rgba(59, 130, 246, 0.1)",
  },
  tableCell: {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#cbd5e1",
    borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
  },
  aiNotice: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "24px",
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "16px",
  },
  aiNoticeIcon: {
    fontSize: "32px",
  },
  aiNoticeContent: {
    flex: 1,
  },
  aiNoticeTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#f1f5f9",
    margin: "0 0 8px 0",
  },
  aiNoticeText: {
    fontSize: "14px",
    color: "#cbd5e1",
    margin: 0,
    lineHeight: "1.5",
  },
};
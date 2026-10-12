# PAWLINK

> **Your dog can't tell you when something feels different. PAWLINK can help you see when something changes.**

PAWLINK is a full-stack smart dog health monitoring platform that transforms continuous wearable telemetry into a visual, real-time understanding of each dog's individual patterns.

Instead of showing owners disconnected numbers and charts, PAWLINK combines live collar data, personalized statistical baselines, anomaly detection, real-time alerts, and an interactive 3D Digital Twin of the dog.

The goal is simple:

**Make an animal's invisible data visible.**

---

## The Idea

Dogs cannot tell us when their body, behavior, activity, or routine feels different.

A wearable device can collect data — but collecting data is not the same as understanding it.

PAWLINK is built around a different question:

> **What if the dog itself became the interface for its own data?**

The physical dog generates the signals.

The PAWLINK backend interprets those signals in relation to that individual dog's normal patterns.

The Digital Twin gives those signals a body.

---

## How PAWLINK Works

```text
Smart Collar Simulator
        ↓
Live Telemetry
        ↓
Node.js / Express API
        ↓
Supabase / PostgreSQL
        ↓
Personal Baseline Engine
        ↓
Anomaly Detection
        ↓
Realtime Event
        ↓
React Application
        ↓
Alert + 3D Health Scan
```

PAWLINK's hardware is simulated for this project, while the application architecture and data pipeline are real.

> **The sensor is simulated. The system is real.**

---

# Core Features

## 1. Smart Collar Simulator

A software-based simulator represents the PAWLINK smart collar and continuously generates telemetry as if it were coming from a real wearable device.

The simulator supports different behavioral states such as:

- Resting
- Walking
- Normal daily activity
- Changing location
- Battery changes
- Normal physiological variation

The simulator sends telemetry through the same backend pipeline that a physical PAWLINK collar could use in the future.

---

## 2. Live Telemetry Pipeline

PAWLINK continuously receives and processes simulated collar data.

Telemetry includes:

- Heart rate
- Body temperature
- Activity level
- Movement
- Rest / sleep
- GPS location
- Battery level
- Collar connectivity
- Timestamped measurements

Incoming measurements are validated, processed, stored, and made available to the frontend.

---

## 3. Dog Profiles

Each dog has an individual PAWLINK profile.

A profile can contain information such as:

- Name
- Breed
- Age
- Weight
- Profile image
- Collar connection
- Current status
- Personal baseline data
- Recent telemetry
- Alert history

The system is designed around individual dogs rather than one universal definition of "normal."

---

## 4. Personal Baseline Engine

PAWLINK learns what is normal **for each individual dog**.

Instead of using machine learning, the project intentionally uses understandable statistical methods to calculate baseline values and normal ranges from historical telemetry.

The baseline can be used for metrics such as:

- Resting heart rate
- Temperature
- Typical activity
- Rest patterns
- Daily movement

This allows PAWLINK to compare a dog's current telemetry with its own historical behavior.

---

## 5. Anomaly Detection

Incoming telemetry is continuously compared with the dog's personal baseline.

When a measurement moves meaningfully outside the dog's usual range, PAWLINK creates an anomaly event.

The system can identify changes such as:

- Unusual heart-rate behavior
- Abnormal temperature readings
- Unexpected activity changes
- Unusual rest patterns
- Significant deviations from the dog's normal behavior

PAWLINK does **not** diagnose medical conditions.

Instead, it communicates that:

> **Something changed from this dog's usual pattern.**

---

## 6. Inject Anomaly

The simulator includes a dedicated **Inject Anomaly** mode.

This allows abnormal telemetry to be intentionally introduced during the live demo.

For example:

```text
Ray's normal heart rate
        ↓
Inject Anomaly
        ↓
Abnormal measurement enters API
        ↓
Backend compares it with Ray's baseline
        ↓
Deviation detected
        ↓
Alert created
        ↓
React UI updates in real time
        ↓
Health Scan highlights the relevant area
```

This makes the entire PAWLINK pipeline demonstrable in real time.

---

## 7. Real-Time Alerts

When an anomaly is detected, PAWLINK creates an alert and sends the update to the frontend without requiring a manual page refresh.

Alerts can display:

- Affected metric
- Current measurement
- Normal range
- Time detected
- Alert status
- Severity / deviation level
- Link to the Health Scan

The language focuses on meaningful changes rather than medical diagnosis.

Example:

> **Ray's heart rate is outside his usual resting range.**

---

# Dashboard

The PAWLINK Dashboard provides an immediate overview of the dog's current state.

It includes:

- Current dog
- Live / connected status
- Current activity state
- Heart rate
- Temperature
- Activity
- Rest
- GPS / location
- Battery
- Recent alerts
- Baseline comparison
- Access to the Health Scan

Telemetry updates dynamically as new data arrives.

The dashboard is designed to answer one question quickly:

> **How is my dog doing right now?**

---

# Interactive 3D Digital Twin

PAWLINK's central visual experience is an interactive 3D Digital Twin of the user's dog.

Instead of presenting every metric as another dashboard card, PAWLINK maps relevant information back onto the animal itself.

The Digital Twin acts as a visual interface between raw telemetry and human understanding.

---

## 3D Health Scan

Health Scan transforms the Digital Twin into a translucent, data-driven visualization.

Different regions of the dog represent different categories of telemetry.

### Cardiovascular

Visualized around the chest / heart area.

Displays:

- Current heart rate
- Resting baseline
- Deviation from normal
- Heart-rate status

### Movement & Activity

Visualized through the legs and movement system.

Displays:

- Activity level
- Movement
- Daily activity
- Current activity state

### Rest & Recovery

Connected to whole-body status.

Displays:

- Rest
- Sleep-related telemetry
- Recovery patterns
- Comparison with normal behavior

### Collar Status

Visualized directly around the PAWLINK collar.

Displays:

- GPS
- Battery
- Connectivity
- Device status

---

## Spatial Anomaly Visualization

When PAWLINK detects an anomaly, the Health Scan does more than display an alert message.

The corresponding area of the Digital Twin visually reacts.

For example:

```text
Heart-rate anomaly
        ↓
Alert generated
        ↓
Health Scan opens
        ↓
Chest / cardiovascular hotspot activates
        ↓
Current value + Ray's normal range appear
```

This connects the backend logic directly to the 3D experience.

---

# Realtime Experience

PAWLINK is designed as a live system.

The user can watch telemetry change as the collar simulator sends new measurements.

The application reacts to events such as:

- New telemetry
- Activity-state changes
- New anomalies
- New alerts
- Collar status changes

The interface updates without requiring a page refresh.

---

# Application Pages

## Home

The public PAWLINK experience introducing:

- The problem
- The PAWLINK concept
- Smart collar
- Health monitoring
- Digital Twin
- Brand campaign
- Product story

## Dashboard

The main live monitoring experience.

## Health Scan

Interactive 3D Digital Twin and spatial telemetry visualization.

## Dog Profile

Individual dog information, baseline data, current status, and health history.

## Simulator

Internal demo controls for generating live telemetry and injecting anomalies.

---

# Demo Scenario

The final demonstration follows one complete end-to-end story.

### 01 — Ray is connected

The PAWLINK collar simulator begins sending normal telemetry.

### 02 — Live data arrives

The backend receives and stores Ray's measurements.

The Dashboard updates in real time.

### 03 — PAWLINK knows Ray's normal

Historical measurements establish Ray's personal statistical baseline.

### 04 — An anomaly is injected

**Inject Anomaly** generates an abnormal measurement.

### 05 — The backend detects the change

The new value is compared with Ray's baseline.

The anomaly detection logic determines that the measurement is outside his usual range.

### 06 — PAWLINK creates an alert

The alert reaches the React application in real time.

### 07 — The user opens Health Scan

Ray's Digital Twin transitions into the Health Scan visualization.

### 08 — The invisible becomes visible

The relevant region of Ray's body is highlighted and the current measurement is shown alongside his normal range.

---

# Architecture

```text
┌──────────────────────────┐
│  PAWLINK Collar Simulator │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│     Node.js / Express     │
│           API             │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│  Supabase / PostgreSQL    │
│                          │
│  Dogs                    │
│  Telemetry               │
│  Alerts                  │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│     Baseline Engine       │
│   Statistical Analysis   │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│    Anomaly Detection      │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│      Realtime Layer       │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│      React Frontend       │
│                          │
│  Dashboard               │
│  Alerts                  │
│  Dog Profile             │
│  Health Scan             │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│    3D Digital Twin        │
│ React Three Fiber /       │
│ Three.js                  │
└──────────────────────────┘
```

---

# Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- CSS
- React Three Fiber
- Three.js

### Backend

- Node.js
- Express
- REST API

### Database & Realtime

- Supabase
- PostgreSQL
- Supabase Realtime / realtime event communication

### 3D

- Cinema 4D
- React Three Fiber
- Three.js
- GLB / GLTF assets

### Development

- Git
- GitHub
- ESLint
- npm

---

# Project Structure

```text
pawlink/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── health-scan/
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── HealthScan.jsx
│   │   ├── DogProfile.jsx
│   │   └── Simulator.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── supabase.js
│   │
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── README.md
└── package.json
```

---

# Product Principles

### Personal, not generic

PAWLINK compares each dog with its own normal patterns.

### Visual, not just numerical

Data should become understandable at a glance.

### Real-time

The system should visibly react when the underlying data changes.

### Explainable

Baseline and anomaly logic use understandable statistics rather than a black-box ML model.

### Focused

One polished end-to-end experience is more valuable than dozens of unfinished features.

### Responsible

PAWLINK is a monitoring and visualization concept.

It does not provide veterinary diagnoses and is not a replacement for professional veterinary care.

---

# The PAWLINK Vision

Traditional pet wearables put the data around the dog.

PAWLINK puts the data **back onto the dog**.

The collar senses.

The backend understands.

The Digital Twin makes it visible.

> **The real dog generates the data.  
> The digital dog gives that data a body.**

---

**PAWLINK — Data you can finally see.**

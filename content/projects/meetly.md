---
title: Meetly: Video Conferencing & Appointment Booking Platform
date: Jan 2025
github: #
status: Production
---

## Overview

A production-grade video conferencing and appointment booking platform built on top of Jitsi Meet, enabling seamless virtual sessions with automated attendance tracking and recording. The system integrates scheduling, meeting orchestration, and cloud-based storage to deliver a complete end-to-end virtual meeting solution.

---

## Architecture
```text
User Booking / Schedule
│
▼
Django Backend (API + Scheduling)
│
├──────► PostgreSQL (Users, Bookings, Metadata)
│
├──────► Redis (Queue + Caching)
│
▼
Celery Workers (Async Tasks)
│
├──────► Jitsi Meet Server (Video Sessions)
│
├──────► Custom Scripts (Attendance Tracking)
│
├──────► FFmpeg (Recording Processing)
│
▼
Cloud Object Storage (Recorded Sessions)
│
▼
Playback / History Access
```

---

## Key Features

- Integrated appointment booking and scheduling system  
- Seamless video conferencing via Jitsi Meet  
- Automated attendance tracking using custom scripts  
- Auto-recording of sessions with cloud storage integration  
- Asynchronous task handling with Celery and Redis  
- Scalable deployment using Docker containers  
- Centralised session history and playback access  

---

## Key Design Decisions

**Jitsi Meet integration**  
Leveraged an open-source, self-hosted video conferencing solution to maintain control over infrastructure and scalability.

**Custom attendance tracking**  
Implemented script-based tracking to automatically log participant join/leave events for accurate attendance records.

**Automated recording pipeline**  
Used FFmpeg and background workers to process, store, and manage session recordings without manual intervention.

**Containerised deployment (Docker)**  
Ensures consistent environments, easier scaling, and simplified deployment across servers.

---

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| Reliable attendance tracking in live sessions | Built custom event-based scripts integrated with Jitsi hooks |
| Managing large recording files | Automated processing and direct upload to cloud object storage |
| Handling concurrent sessions | Scaled via Dockerised services and distributed task queues |
| Recording failures or interruptions | Implemented retry and validation mechanisms in Celery workers |

---

## Results

1. Delivered a fully automated virtual meeting and booking platform  
2. Eliminated manual attendance tracking with reliable automation  
3. Enabled seamless recording and cloud storage of sessions  
4. Scaled efficiently using containerised deployment architecture  
5. Improved operational efficiency for managing online sessions  

---
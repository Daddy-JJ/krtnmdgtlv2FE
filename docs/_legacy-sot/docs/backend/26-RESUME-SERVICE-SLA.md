# Resume Service SLA

Store all timestamps in UTC and calculate against the repository timezone
standard.

- Duration: 48 working hours.
- Working time: Monday through Friday.
- Weekend `DATA_COMPLETE` starts on next Monday at the same wall-clock time.
- `NEED_MORE_INFORMATION` pauses the remaining duration.
- A subsequent `DATA_COMPLETE` resumes it.
- Historical due dates are persisted; admin extension requires reason/audit.
- Breach is visible and never automatically cancels a request.

Tests cover Thursday, Friday, Saturday, pause/resume, met/breached, and timezone
consistency.

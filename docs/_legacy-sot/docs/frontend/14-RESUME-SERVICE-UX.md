# Resume Service UX

Member pages:

- `/app/resume-enhancement/`
- `/app/resume-enhancement/new/`
- `/app/resume-enhancement/request/?id={publicId}`
- `/app/resume-enhancement/revision/?id={publicId}`

Operational pages live under `/admin/resume-services/` and provide overview,
queues, request workspace, quality review, revisions, retention, and audit.

The UI uses the existing HTML, compiled Tailwind CSS, and vanilla JavaScript
stack. It never renders internal notes, raw storage paths, or document content
in overview cards. Backend eligibility, assignment, retention, and workflow
state are authoritative.

The new-request form separates the required career brief from optional support
information. Pasted resume text, job description, additional achievements, and
certifications are explicitly marked optional and use spacious, resizable text
areas with short guidance. One required combined checkbox presents the five
resume-service acknowledgements; the frontend maps that acceptance to the five
existing API consent flags so server-side validation remains authoritative.

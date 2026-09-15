# Lunara AI Hub

LUNARA BOX — AI CALLS

Production-Ready Self-Hosted AI Communications Platform — Frontend

Build a complete, production-quality frontend for a self-hosted AI communications appliance called Lunara Box — AI Calls.

This is NOT a marketing website.

This is the actual web application/control panel that will eventually run locally inside Docker on the customer’s own computer or mini-PC.

The frontend must be designed as a professional enterprise SaaS-style application, but it will ultimately be self-hosted and accessed through:

http://localhost:<port>

The frontend must never depend on Lovable at runtime.

The final frontend must be exportable to GitHub and deployable as a normal React application inside Docker.



1. CORE PRODUCT CONCEPT

Lunara Box is a self-hosted AI communications platform that turns a computer or mini-PC into an autonomous AI communications center.

It supports:

AI-powered inbound phone calls

AI-powered outbound phone calls

WhatsApp conversations

WhatsApp voice messages

Gmail/email communications

Web chat

CRM integration

Customer management

AI employees

Knowledge base

Call recording

Call transcripts

Message transcripts

AI summaries

Lead qualification

Appointment scheduling

Human handoff

Campaign/outbound calling

Multiple communication channels

Local AI

Cloud realtime AI

Analytics

System health

Backup and restore

Docker/self-hosted deployment

The frontend must make all of this extremely simple.

The user should never need to understand Docker containers, Asterisk, FreePBX, Ollama, Faster-Whisper, Piper, Baileys, PostgreSQL, Redis, APIs, RTP, SIP, WebSockets, or other infrastructure.

Those are implementation details hidden behind the Lunara Box interface.



2. TWO AI MODES ONLY

The system has exactly TWO AI modes.

MODE A — LOCAL AI

Everything required for voice AI runs locally.

Architecture:

Phone
→ Asterisk / FreePBX
→ Voice Gateway
→ Faster-Whisper STT
→ Local LLM through Ollama
→ Piper TTS
→ Asterisk
→ Phone

Local AI means:

Local LLM

Faster-Whisper

Piper

Local knowledge base

Local conversation processing

No cloud AI API required

The UI should describe this simply as:

“Runs entirely on your computer.”

Do not expose technical complexity unless the user opens Advanced Settings.



MODE B — REALTIME AI

Voice calls use a realtime cloud AI model through API.

Architecture:

Phone
→ Asterisk / FreePBX
→ Realtime Gateway
→ Realtime AI provider
→ Audio response
→ Asterisk
→ Phone

Support the concept of providers such as:

OpenAI Realtime

Google Gemini Live / realtime voice models

Future realtime providers

The user enters an API key, connects the provider, retrieves available models and selects the model.

Do NOT expose Faster-Whisper or Piper configuration in Realtime mode because the realtime model handles the voice pipeline.



3. VERY IMPORTANT UX PRINCIPLE

The user must NEVER configure:

LLM → STT → TTS → Phone manually.

Instead:

The user chooses:

LOCAL AI

or

REALTIME AI

The platform automatically builds the correct voice pipeline.

For Local AI:

LLM = Ollama
STT = Faster-Whisper
TTS = Piper

For Realtime AI:

Realtime model = selected cloud provider/model

The UI must make this relationship visually obvious.



4. APPLICATION LAYOUT

Create a polished enterprise application with:

Left sidebar navigation

Top navigation/header

Main content area

Responsive layout

Desktop-first design

Tablet support

Mobile-friendly secondary views

Dark/light mode support

Professional typography

Clean cards

Subtle animations

Status indicators

Empty states

Loading states

Error states

Confirmation dialogs

Toast notifications

Search

Filters

Pagination

Modal dialogs

Drawers where appropriate

The visual language should feel like a premium modern AI infrastructure/productivity application.

Do NOT make it look like a generic CRM.

Do NOT make it look like a crypto dashboard.

Do NOT make it look like a template.

It should feel like a serious enterprise AI product.

Brand:

LUNARA BOX

Subtitle:

AI CALLS

Primary UI language: English.



5. MAIN NAVIGATION

Create the following sidebar:

Overview

AI Employees

Calls

All Calls

Inbound

Outbound

Campaigns

Conversations

All Conversations

WhatsApp

Email

Web Chat

Contacts

CRM

Knowledge

Calendar

Analytics

Integrations

System

Settings

At the bottom:

System status indicator:

🟢 All systems operational

User profile menu.



6. OVERVIEW DASHBOARD

Create a professional dashboard.

Header:

“Good morning”

“Your AI communication center is running normally.”

Display cards:

Calls Today

Total calls

Inbound

Outbound

Missed

AI handled

Human handoff

Conversations

WhatsApp

Email

Web

Other connected channels

AI Employees

Active

Offline

Busy

AI Minutes

Used today

Used this month

Leads

New leads

Qualified leads

Converted leads

Appointments

Today

Upcoming

System Health

AI

Telephony

WhatsApp

Database

Storage

Add a realtime activity stream:

“Anna answered a call”

“New WhatsApp message”

“Lead qualified”

“Appointment booked”

“Human handoff”



7. AI EMPLOYEES

This is one of the most important sections.

Create an AI Employee management page.

Cards for each AI employee:

Example:

Anna
Sales Manager

Status:
🟢 Ready

Brain:
Local AI · Qwen3

Voice:
Piper · English Female

Channels:
Phone
WhatsApp
Web

Knowledge:
18 documents

Today’s activity:
27 calls
43 conversations

Buttons:

[Open]
[Edit]
[Pause]



8. CREATE AI EMPLOYEE WIZARD

Make this an exceptionally simple guided wizard.

Step 1:

Name your AI employee

Name:

[ Anna ]

Step 2:

What does this employee do?

Options:

Receptionist

Sales

Customer Support

Lead Qualification

Appointment Booking

Customer Service

Collections

Custom

Step 3:

Choose AI Mode

Two beautiful cards.

LOCAL AI

“Everything runs on your computer.”

Benefits:

Private

No cloud AI API

Works offline

Your data stays local

Button:

[ Use Local AI ]

REALTIME AI

“Use a realtime cloud voice model.”

Benefits:

Extremely natural voice conversations

Low latency

Premium AI models

Button:

[ Use Realtime AI ]



9. LOCAL AI CONFIGURATION

When Local AI is selected:

Display hardware detection:

CPU
RAM
GPU if available

Example:

“Your computer”

CPU: Ryzen 7
RAM: 32 GB
GPU: Detected

Then:

Recommended model

Show:

Qwen3 8B

“Recommended for your hardware”

Alternative models:

Qwen3 14B
Qwen3 32B
Llama models
Other compatible Ollama models

Every model should have:

Name

Size

RAM requirement

Quality indicator

Speed indicator

Recommended badge

Button:

[ Install Model ]

During installation show progress.

After installation:

🟢 Model ready



10. REALTIME AI CONFIGURATION

Provider selection:

AI Provider

Cards:

OpenAI
Google Gemini

Future-ready placeholder:

Other providers

When OpenAI selected:

API Key:

[ **************** ]

Button:

[ Connect ]

Then:

“Retrieving available models…”

Display available realtime models.

User selects model.

Example:

GPT Realtime

GPT Realtime Mini

Show:

Quality

Latency

Cost

Recommended badge

When connected:

🟢 Connected

API key must be visually masked.

Never display the full API key.



11. VOICE SETTINGS — LOCAL MODE ONLY

Local mode automatically uses:

STT:
Faster-Whisper

TTS:
Piper

Do not ask the user to configure technical settings during normal setup.

Display:

Speech Recognition

Faster-Whisper

🟢 Ready

Model:
Automatic

Button:

[ Advanced ]

Voice

Piper

Language:
English

Voice:
Female

Button:

[ Change Voice ]

Voice selector:

Language

Gender

Voice name

Preview button

[▶ Preview]



12. REALTIME MODE VOICE SETTINGS

Do NOT show Faster-Whisper or Piper.

Instead:

“Voice is handled by your selected realtime AI model.”

Show:

Provider
Model
Voice

Example:

OpenAI
GPT Realtime
Voice: Alloy

Button:

[ Change Voice ]



13. PHONE / TELEPHONY

Create a dedicated Phone page.

The underlying technology is:

FreePBX / Asterisk.

Do not expose this terminology in the normal UI.

The user sees:

Phone System

Status:

🟢 Connected

Phone numbers:

+1 …
+373 …
etc.

Button:

[ Add Phone Number ]



14. PHONE NUMBER CONNECTION

Wizard:

How do you want to connect your phone?

Options:

SIP Provider

“Connect an existing SIP account.”

Fields:

SIP Server
Username
Password

Button:

[ Connect ]

Existing PBX

“Connect your existing phone system.”

Fields should be shown only when selected.

SIP Phone

Allow registering a physical SIP phone.

All technical Asterisk configuration is handled automatically by the backend.



15. CONNECT PHONE NUMBER TO AI EMPLOYEE

Example:

Phone Number:

+373 XX XXX XXX

AI Employee:

[ Anna ▼ ]

Call handling:

○ AI answers all calls

○ Human first

○ AI answers after X seconds

Enable recording:

[ ON ]

Enable transcription:

[ ON ]

Enable AI summary:

[ ON ]

Button:

[ Save ]



16. INBOUND CALLS

Create an inbound call list.

Columns:

Date
Time
Caller
AI Employee
Duration
Status
Intent
Lead
Result

Status examples:

AI handled
Transferred
Missed
Failed
Completed

Clicking a call opens the call details page.



17. CALL DETAILS

Create a highly polished call details view.

Header:

Caller
Phone number
Date
Duration

Actions:

[ Play Recording ]

[ Download Recording ]

[ Download Transcript ]

[ Add to CRM ]

[ Call Back ]

[ Transfer ]

Then:

AI Summary

Short summary.

Intent

Sales inquiry

Outcome

Qualified lead

Sentiment

Positive

Transcript

Full searchable transcript.

Highlight speakers:

AI
Customer

Add timestamps.

Example:

00:04 Customer:
…

00:08 AI:
…

AI Actions

Show actions taken:

✓ Customer created
✓ Lead created
✓ Appointment booked
✓ Follow-up scheduled



18. OUTBOUND CALLING

This is a major feature.

Create:

Outbound Calls

Two modes:

Single Call

User enters:

Phone number:

[ +1 __________ ]

Select AI Employee:

[ Anna ]

Purpose:

[ Sales follow-up ]

Button:

[ Start Call ]

Show confirmation before placing the call.



19. OUTBOUND CAMPAIGNS

Create:

Call Campaigns

Button:

[ Create Campaign ]

Wizard:

Campaign name

Example:

“September Sales Outreach”

Upload contacts

Support:

CSV
XLSX

Allow drag-and-drop upload.

Automatically detect:

Name
Phone
Company
Email
Custom fields

Show preview.

Example:

Imported:
1,248 contacts

Valid numbers:
1,196

Invalid:
52

Button:

[ Continue ]



20. OUTBOUND CAMPAIGN SETTINGS

Select:

AI Employee

Phone number

Calling hours

Maximum concurrent calls

Retry policy

Maximum attempts

Delay between attempts

Voicemail handling

Recording

Transcription

AI summary

CRM update

Campaign objective:

Sales

Lead qualification

Appointment booking

Customer follow-up

Survey

Payment reminder

Custom

Button:

[ Launch Campaign ]



21. CAMPAIGN DASHBOARD

Display:

Total contacts
Queued
Calling
Completed
Answered
No answer
Busy
Failed
Interested
Not interested
Qualified
Appointments
Conversions

Progress bar.

Realtime activity:

“Calling +1…”

“Answered”

“Lead qualified”

“Appointment booked”

Allow:

[ Pause Campaign ]

[ Resume ]

[ Stop ]



22. OUTBOUND CALL SAFETY UX

Before launching a campaign show a clear confirmation:

“You are about to start an outbound calling campaign.”

Display:

Contacts:
1,248

Estimated calls:
1,248

AI Employee:
Anna

Phone:
+1…

Calling schedule:
9:00–18:00

Buttons:

[ Cancel ]

[ Launch Campaign ]



23. WHATSAPP

Use Baileys as the WhatsApp connector.

Do NOT discuss implementation details in normal UI.

Create:

WhatsApp

Status:

🟢 Connected

Show connected WhatsApp account.

Button:

[ Connect WhatsApp ]

When not connected:

Display QR code.

Instructions:

Open WhatsApp

Go to Linked Devices

Link a Device

Scan this QR code

Realtime status:

Waiting for scan
Connected
Disconnected
Reconnect



24. WHATSAPP INBOX

Create a modern messaging interface.

Left:

Conversation list.

Right:

Selected conversation.

Display:

Contact
Phone
Last activity
AI employee

Messages.

Support:

Text
Images
Documents
Audio
Voice messages

Voice message:

[▶ Play]

Transcription:

“Customer’s transcribed message…”

Actions:

[ Reply ]

[ Let AI handle ]

[ Take over ]

[ Create CRM Lead ]

[ Schedule Call ]



25. EMAIL / GMAIL

Create an Email integration.

Supported concept:

Gmail

Allow:

Connect Gmail

OAuth-style connection UI.

Do not ask users to manually configure technical webhooks.

Once connected:

🟢 Gmail connected

Create email inbox:

Inbox
Sent
Follow-up
AI handled
Needs human

AI can:

Read incoming messages
Draft responses
Send responses
Summarize messages
Create CRM records
Create tasks
Extract contacts
Extract leads



26. UNIVERSAL CONVERSATION INBOX

Create:

Conversations

This is a unified communication center.

Channels:

All
Phone
WhatsApp
Email
Web
SMS
Other connected channels

Every conversation should display:

Customer
Channel
AI Employee
Last message
Status
Sentiment
Lead status

Filters:

Unread
Needs attention
AI handled
Human required
Positive
Negative
Sales
Support



27. UNIVERSAL SEARCH

Create global search.

Search across:

Contacts
Calls
Transcripts
WhatsApp messages
Emails
Conversations
CRM
Knowledge
AI Employees

Example:

Search:
“John Smith”

Results:

Contact
3 calls
7 WhatsApp messages
2 emails
1 appointment



28. CONTACTS

Create a complete customer directory.

Fields:

Name
Phone
Email
Company
Tags
Lead status
Source
Last contact
Assigned AI Employee

Contact detail page:

Profile
Timeline
Calls
WhatsApp
Emails
Appointments
CRM
Notes
AI summaries



29. TRANSCRIPTS CENTER

Create a dedicated page:

Transcripts

Allow users to access transcripts from EVERY communication channel.

Filters:

Phone
WhatsApp
Email
Web
Date
AI Employee
Contact
Language

Actions:

[ View ]

[ Download TXT ]

[ Download PDF ]

[ Download DOCX ]

[ Export CSV ]



30. BULK EXPORT

Create:

Export Center

Allow:

Export all call transcripts
Export all WhatsApp transcripts
Export all email conversations
Export all conversations
Export selected contacts
Export selected calls

Export formats:

TXT
CSV
JSON
PDF
DOCX

Show progress for large exports.



31. RECORDINGS

Create:

Call Recordings

List all recorded calls.

Columns:

Date
Caller
AI Employee
Duration
Direction
Campaign
Status

Actions:

Play
Download
Delete

Include search and date filters.



32. CRM INTEGRATIONS

Create a dedicated:

CRM

Supported integrations:

HubSpot

Connect

OAuth/API configuration.

Status:

🟢 Connected

Salesforce

Connect

OAuth/API configuration.

Status:

🟢 Connected

Bitrix24

Connect

Webhook/API configuration.

Status:

🟢 Connected

Also support:

FreeScout

FreeScout is the built-in/local helpdesk.

The user should be able to select a primary CRM.

Example:

Primary CRM:
[ HubSpot ▼ ]



33. CRM MAPPING

After connecting a CRM show:

Data Mapping

Map:

Lunara Contact
→ CRM Contact

Lunara Lead
→ CRM Lead

Lunara Company
→ CRM Company

Call
→ CRM Activity

WhatsApp conversation
→ CRM Activity

Email
→ CRM Activity

Appointment
→ CRM Meeting

Allow:

Automatic synchronization:
[ ON ]



34. CRM ACTIONS

For every call/conversation allow:

Create contact
Create lead
Update contact
Create deal
Create task
Create note
Create activity
Create appointment

AI employees should be able to execute these actions through the backend.

The frontend must provide the configuration UI.



35. CALENDAR

Create:

Calendar

Support the concept of:

Google Calendar
Microsoft Calendar
CRM calendar

Display:

Today
Week
Month

AI can book appointments during conversations.

Settings:

Working hours
Available days
Appointment duration
Buffer
Timezone



36. KNOWLEDGE BASE

Create:

Knowledge

This must be extremely simple.

Text:

“What should your AI employee know?”

Upload:

PDF
DOCX
TXT
CSV
XLSX

Drag and drop.

Show documents:

Company FAQ
Products
Pricing
Policies
Scripts
Manuals

Each document:

Name
Size
Status
Uploaded
Used by

Status:

Processing
Ready
Error

Do not expose vector databases, embeddings, chunks, RAG, or other technical terminology in the normal UI.



37. AI EMPLOYEE KNOWLEDGE

Allow assigning knowledge to each AI employee.

Example:

Anna

Knowledge:

✓ Product catalog
✓ Pricing
✓ Sales FAQ

Not assigned:

Customer support manual

Button:

[ Manage Knowledge ]



38. HUMAN HANDOFF

Create settings:

Human Handoff

AI can transfer conversations to humans.

Triggers:

Customer requests human

AI confidence too low

Complaint

Sensitive issue

Sales escalation

Custom trigger

When transferred:

Show operator:

Customer
Reason
Conversation history
AI summary
Transcript
CRM data



39. AI BEHAVIOR SETTINGS

For every AI Employee:

Tone:

Professional
Friendly
Formal
Concise
Custom

Language:

English
Russian
Romanian
Ukrainian
German
French
Spanish
etc.

Custom system instructions:

Large text area.

Example:

“You are a professional sales assistant…”

Allow advanced instructions.



40. ANALYTICS

Create:

Analytics

Charts and KPIs:

Calls
Inbound
Outbound
Answered
Missed
AI resolution rate
Human handoff rate
Average call duration
Average response time
Leads generated
Qualified leads
Appointments
Conversion rate

WhatsApp:

Messages
AI handled
Human handled
Response time

Email:

Messages
AI replies
Human replies
Response time

Campaigns:

Calls
Answer rate
Qualified rate
Conversion

Allow date range:

Today
7 days
30 days
90 days
Custom



41. SYSTEM HEALTH

Create:

System

Show health cards:

AI Engine
🟢 Running

Ollama
🟢 Running

Faster-Whisper
🟢 Running

Piper
🟢 Running

Asterisk
🟢 Running

WhatsApp
🟢 Connected

Database
🟢 Running

Storage
🟢 Healthy

For Realtime mode, replace Local AI services with:

Realtime Gateway
🟢 Running

Provider
🟢 Connected

The user should see friendly messages, NOT raw Docker errors.



42. DIAGNOSTICS

Create:

Diagnostics

Button:

[ Run Full System Check ]

Checks:

AI
Voice
Telephony
WhatsApp
Database
Storage
CRM
Email
Internet connectivity

Show:

✓ Passed
⚠ Warning
✕ Failed

For every error provide:

Problem
Why it matters
Recommended action

Example:

“WhatsApp connection lost.”

[ Reconnect WhatsApp ]



43. SETTINGS

Create:

General
AI
Voice
Phone
WhatsApp
Email
CRM
Calendar
Knowledge
Security
Users
Notifications
Backup
Updates
Advanced



44. BACKUP

Create:

Backup & Restore

Buttons:

[ Create Backup ]

[ Restore Backup ]

Backup should conceptually include:

AI employees
Settings
Knowledge
Contacts
Conversations
CRM configuration
Call metadata
Transcripts

Show:

Last backup
Backup size
Backup status



45. UPDATES

Create:

System Updates

Show:

Current version
Latest version

Example:

Current:
v1.0.3

Available:
v1.0.4

Button:

[ Update System ]

Show update progress.



46. SECURITY

Create:

Security

Password
Session timeout
Local network access
HTTPS status
API key management
Audit log

API keys must always be masked.



47. USERS

For future multi-user support:

Admin
Manager
Operator
Viewer

Permissions UI.



48. NOTIFICATIONS

Configure:

Call completed
Lead created
Human handoff
Campaign completed
System failure
WhatsApp disconnected
CRM disconnected



49. API / CONNECTOR ARCHITECTURE

IMPORTANT:

The frontend must be designed around a clean backend API.

Do NOT directly couple the frontend to:

Ollama
Asterisk
FreePBX
Baileys
Faster-Whisper
Piper
PostgreSQL

Instead frontend communicates with a unified Lunara backend API.

Use conceptual API namespaces:

/api/system
/api/ai
/api/agents
/api/models
/api/voice
/api/phone
/api/calls
/api/campaigns
/api/whatsapp
/api/conversations
/api/email
/api/contacts
/api/crm
/api/calendar
/api/knowledge
/api/transcripts
/api/recordings
/api/analytics
/api/integrations
/api/settings
/api/backup

The frontend must be written so these endpoints can later be connected to the real Docker backend.



50. LLM PROVIDER ABSTRACTION

The frontend must not assume a specific LLM provider.

Create a provider abstraction.

Supported:

Local:
Ollama

Cloud realtime:
OpenAI
Google Gemini

Future:
Custom realtime provider

The UI should represent them as providers.



51. IMPORTANT LOCAL MODEL UX

When Local AI is selected:

Detect hardware.

Show recommended models.

The user selects ONE model.

The system installs it automatically.

Do not expose technical model installation commands.

Example:

“Qwen3 8B”

“Recommended for your computer”

[Install]

Progress:

Downloading model…
Installing…
Testing…
Ready.

Then:

🟢 AI is ready.



52. IMPORTANT REALTIME MODEL UX

When Realtime AI is selected:

Provider
→ API key
→ Connect
→ Retrieve available models
→ Select model
→ Select voice
→ Test connection
→ Ready.

Never force users to manually type model IDs if the API can provide them.



53. AI TEST CENTER

Create:

Test AI

Allow the user to test the selected AI employee before going live.

Modes:

Text test
Voice test
Phone test

Text:

User enters:

“Hello, what services do you provide?”

AI responds.

Voice:

[ Start Voice Test ]

Phone:

[ Call Me ]

The backend will eventually trigger a real test call.



54. GLOBAL AI STATUS

Always show AI status somewhere in the interface.

Examples:

🟢 AI Ready

🟡 AI Busy

🔴 AI Offline

If the AI is unavailable, show a clear explanation and action.



55. DESIGN SYSTEM

Use a premium modern visual system.

Requirements:

Elegant

Minimal

Professional

Enterprise-grade

AI-native

High information density without feeling cluttered

Use:

Rounded cards

Subtle borders

Soft shadows

Clear hierarchy

Excellent spacing

High-quality icons

Beautiful empty states

Smooth transitions

Professional tables

Modern charts

Avoid:

Excessive gradients

Neon cyberpunk style

Excessive glassmorphism

Cartoon illustrations

Generic SaaS template appearance

Excessive animations

The product should look credible to:

SMBs

enterprise companies

telecom companies

hospitals

banks

government organizations

call centers



56. COLOR SYSTEM

Create a refined Lunara brand palette.

Primary:
Deep dark blue / indigo family

Accent:
Lunara purple / violet

Success:
Green

Warning:
Amber

Error:
Red

Keep colors restrained and professional.

Support both:

Light mode
Dark mode



57. RESPONSIVE BEHAVIOR

Desktop is primary.

Tablet supported.

Mobile should provide usable:

Conversations

Calls

Contacts

AI Employee status

Notifications

Complex configuration can remain optimized for desktop.



58. EMPTY STATES

Every section must have a useful empty state.

Example:

No AI employees yet.

“Create your first AI employee and start handling calls automatically.”

[ Create AI Employee ]

No phone connected.

“Connect a phone number to let your AI answer calls.”

[ Connect Phone ]

No WhatsApp.

“Connect WhatsApp to let your AI handle customer messages.”

[ Connect WhatsApp ]



59. ERROR HANDLING

Never show technical errors directly.

Instead of:

“ECONNREFUSED 127.0.0.1:11434”

show:

“Local AI is not responding.”

Details:

“The AI engine is currently unavailable.”

Action:

[ Restart AI ]

[ Run Diagnostics ]



60. MOCK DATA

For the initial Lovable implementation, use realistic mock data.

Create:

5 AI employees
100+ contacts
50+ calls
100+ conversations
WhatsApp conversations
Email conversations
CRM records
Knowledge documents
Campaigns
Analytics

The UI should feel like a real functioning product even before the backend is connected.



61. COMPONENT ARCHITECTURE

Build reusable components.

Examples:

AIEmployeeCard
AIStatusBadge
ProviderSelector
ModelSelector
VoiceSelector
PhoneConnectionWizard
WhatsAppQRCode
CallTable
CallDetails
TranscriptViewer
AudioPlayer
ConversationList
ConversationViewer
ContactCard
CRMConnector
KnowledgeUploader
CampaignBuilder
CampaignProgress
SystemHealthCard
DiagnosticsPanel
BackupPanel
SettingsPanel
GlobalSearch
NotificationCenter



62. STATE ARCHITECTURE

Keep frontend state clean and modular.

Separate:

authentication state

system state

AI state

employee state

call state

conversation state

CRM state

integration state

settings state

Prepare the application for realtime WebSocket/SSE updates later.

Examples:

Call status changes in realtime.

Campaign progress updates in realtime.

WhatsApp messages appear in realtime.

System health updates in realtime.



63. REALTIME UI

Design the frontend so backend can later push events through WebSocket or Server-Sent Events.

Events:

call.started
call.ringing
call.answered
call.completed
call.transcript.updated
message.received
message.sent
whatsapp.connected
whatsapp.disconnected
campaign.progress
ai.status_changed
system.health_changed

The UI should update automatically.



65. FIRST-RUN EXPERIENCE

If this is the first launch, do NOT show the full dashboard immediately.

Show:

Welcome to Lunara Box

“Let’s set up your first AI employee.”

Button:

[ Start Setup ]

Wizard:

AI employee name

Role

AI mode

Model

Voice

Phone

WhatsApp

Knowledge

Test

Finish

At the end:

Your AI employee is ready.

🧠 Brain — Ready
🎤 Hearing — Ready
🗣 Voice — Ready
☎ Phone — Connected
💬 WhatsApp — Connected
📚 Knowledge — Ready

Large button:

GO LIVE



66. FINAL PRODUCT PRINCIPLE

The interface must communicate one simple idea:

“Install once. Configure once. Your AI employee works.”

Technical complexity belongs inside the platform.

The customer should not need to know:

Docker
Asterisk
FreePBX
Ollama
Faster-Whisper
Piper
Baileys
PostgreSQL
Redis
RTP
WebSockets
API architecture

unless they explicitly open Advanced Settings.



67. IMPORTANT IMPLEMENTATION REQUIREMENT

Build this as a real frontend application, not a static visual mockup.

Use:

React

TypeScript

Tailwind CSS

Reusable components

Clean routing

Proper state management

Mock service/API layer

Clear separation between UI and backend services

Create an abstraction such as:

src/services/api/

The UI should call mock API services through this abstraction.

Later the mock implementation can be replaced with the real Lunara Box backend without rebuilding the UI.



68. DOCKER-READY FRONTEND

The final project must be capable of being built into a Docker container.

Conceptually:

Browser
→ Nginx
→ Lunara Frontend
→ /api/*
→ Lunara Backend

The frontend must NOT require Lovable to function after deployment.

The production deployment should work on localhost.



69. PRIORITY ORDER

Prioritize these screens first:

First-run setup wizard

Dashboard

AI Employees

AI Employee configuration

Local AI configuration

Realtime AI configuration

Phone configuration

WhatsApp

Calls

Call details/transcripts

Outbound calling

Campaigns

Conversations

Contacts

CRM

Knowledge

Analytics

System health

Integrations

Settings

Make the first 13 especially polished.



70. THE MOST IMPORTANT UX TEST

Imagine a non-technical business owner downloads Lunara Box.

They run:

docker compose up -d

They open the local web interface.

They should be able to understand what to do without reading documentation.

They should be able to create:

“Anna — Sales Manager”

Choose:

“Local AI”

Choose:

“Qwen3 8B”

The system automatically uses:

Faster-Whisper
Piper

Then:

Connect phone

Connect WhatsApp

Upload product PDF

Test AI

Go Live

This entire experience should feel simple, obvious and premium.



71. FINAL REQUEST

Create the complete Lunara Box — AI Calls frontend now.

Do not create a landing page.

Create the actual application.

Use realistic mock data.

Build all routes, screens, modals, wizards, tables, dashboards, forms, empty states, loading states and error states.

Make the application visually impressive but extremely usable.

The frontend will later be exported to GitHub, placed into the Lunara Box Docker architecture, and connected to the real backend API.

The final result should feel like a serious commercial product that could be installed by a business and used as its central AI communications system.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/55a404eb-6845-4861-9df4-4e5ead1c7e86).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

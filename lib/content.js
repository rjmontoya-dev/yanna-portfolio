/**
 * All site copy lives here. Edit text, links and contact details in one place.
 * Icons refer to keys in components/Icon.jsx.
 */

export const site = {
  name: 'Yanaleen Peregrino',
  role: 'Virtual Assistant',
  email: 'pyanaleenazaler@gmail.com',
  phone: '+63 970 036 8082',
  location: 'Calapan City, Philippines',
  resumeUrl: '/resume.pdf', // file lives in /public/resume.pdf
};

export const hero = {
  eyebrow: 'Available for new clients',
  // The typed line in the hero cycles through these.
  roles: ['Virtual Assistant', 'Executive Support', 'Appointment Setter', 'GoHighLevel Specialist', 'Canva Designer'],
  lead:
    'Highly organized, detail-oriented Virtual Assistant with 5+ years of experience supporting executives and entrepreneurs: managing schedules, handling communications, and getting projects done.',
  highlights: ['5+ years experience', '95% five-star ratings', 'Remote · Philippines'],
};

/** The animated "task board" card in the hero. */
export const taskBoard = {
  title: "Today's support",
  tasks: [
    { time: '08:30', label: 'Inbox triaged & priority replies sent' },
    { time: '10:00', label: '3 qualified appointments booked' },
    { time: '13:00', label: 'GoHighLevel follow-up automation live' },
    { time: '15:30', label: 'Weekly report delivered to CEO' },
  ],
  badge: '10+ hrs saved this week',
};

export const marquee = [
  'Calendar Management',
  'Inbox Zero',
  'Appointment Setting',
  'Cold Calling',
  'CRM Management',
  'GoHighLevel',
  'Canva Design',
  'Research & Reports',
  'Data Entry',
  'Travel & Events',
];

export const about = {
  title: ['Calm, capable support for ', 'busy leaders', '.'],
  paragraphs: [
    'I help executives and entrepreneurs get their time back. My background spans administrative support, cold calling, appointment setting, and back-office operations, so I can keep your calendar, inbox, CRM, and pipeline organized at the same time.',
    "I'm a confident communicator with strong phone presence, and I build rapport with clients and decision-makers across industries. Most of all, I'm reliable: the remote-work support that helps a business run smoothly and grow.",
  ],
  stats: [
    { value: '5+', label: 'Years in virtual assistance' },
    { value: '95%', label: 'Clients rated 5 stars' },
    { value: '3', label: 'Professional certifications' },
    { value: 'Remote', label: 'Freelance & remote work' },
  ],
};

export const skills = [
  {
    icon: 'clipboard',
    title: 'Administrative Skills',
    text: 'Calendar management, email handling, and document preparation, plus virtual meetings set up end to end.',
  },
  {
    icon: 'monitor',
    title: 'Technical Proficiency',
    text: 'Microsoft Office (Word, Excel, PowerPoint), Google Workspace, Asana, Trello, Zoom, Slack, and Calendly.',
  },
  {
    icon: 'message',
    title: 'Communication',
    text: 'Clear written and verbal communication, customer service, and confident phone presence with decision-makers.',
  },
  {
    icon: 'layers',
    title: 'Organization',
    text: 'Time management, multitasking, project coordination, and research that keeps priorities on track.',
  },
  {
    icon: 'pen',
    title: 'Canva Editing',
    text: 'Professional graphics, social media content, and marketing materials that stay on-brand.',
  },
  {
    icon: 'zap',
    title: 'GoHighLevel Expert',
    text: 'CRM setup, automations, funnel building, and client management systems that follow up for you.',
  },
];

/** The nine tools shown on the interactive 3D orb (and its accessible list). */
export const orbTools = [
  { name: 'Calendar', description: 'Executive calendars, meetings, and travel arranged across time zones, with focus time protected.' },
  { name: 'Email', description: 'Correspondence handled, messages filtered, and inquiries answered on time. Inbox efficiency up 60%.' },
  { name: 'Canva', description: 'Graphics, social media visuals, and marketing materials that strengthen client branding.' },
  { name: 'Google Workspace', description: 'Docs, Sheets, and Drive organized into shared, searchable systems.' },
  { name: 'Asana', description: 'Project tasks, owners, and deadlines tracked so progress is always visible.' },
  { name: 'Trello', description: 'Visual boards for content calendars, onboarding, and recurring tasks.' },
  { name: 'Slack', description: 'Organized channels, quick follow-ups, and clear async communication with your team.' },
  { name: 'Zoom', description: 'Video calls set up, agendas prepared, and meetings facilitated from start to finish.' },
  { name: 'GoHighLevel', description: 'CRM pipelines, automations, funnels, and client follow-up sequences built and maintained.' },
];

export const toolkit = [
  { icon: 'file', name: 'Microsoft Office', detail: 'Word, Excel, PowerPoint' },
  { icon: 'calendar', name: 'Google Workspace', detail: 'Docs, Sheets, Drive' },
  { icon: 'layers', name: 'Project Management', detail: 'Asana, Trello' },
  { icon: 'users', name: 'Communication', detail: 'Zoom, Slack' },
  { icon: 'pen', name: 'Canva', detail: 'Graphics & social content' },
  { icon: 'zap', name: 'GoHighLevel', detail: 'CRM, automation, funnels' },
];

/**
 * Work history from the resume. The team-lead role has no dates on the
 * resume, so its period is a label. Replace it with real dates.
 */
export const experience = [
  {
    role: 'Team Lead · Subject Matter Expert',
    org: 'Cold Calling & Appointment Setting',
    period: 'Latest role',
    items: [
      ['Team Leadership', 'Led a team of agents to consistent results across cold calling and appointment-setting campaigns.'],
      ['Coaching & Training', 'Gave guidance, training, and real-time support to improve call quality and conversion rates.'],
      ['Subject Matter Expert', 'Supported the team with scripts, objection handling, and client-specific processes.'],
      ['Lead Qualification', 'Made high-volume outbound calls to engage prospects, qualify leads, and book appointments.'],
      ['CRM & KPIs', 'Kept CRM records accurate, tracked daily metrics, and met or exceeded every target.'],
      ['Strategy', 'Worked with management to refine strategies and improve campaign workflows.'],
    ],
  },
  {
    role: 'Administrative Assistant',
    org: 'Senior management support',
    period: 'Oct 2021 – 2023',
    items: [
      ['Senior Management Support', 'Calendar management, data entry, and document preparation for leadership.'],
      ['Events & Travel', 'Coordinated company events, meetings, and travel arrangements.'],
      ['Vendor & Inventory', 'Managed office supply inventory and liaised with vendors on timely delivery.'],
      ['Filing Systems', 'Developed and maintained electronic and paper-based filing systems.'],
      ['Project Coordination', 'Assisted with project management tasks and tracked progress.'],
    ],
  },
  {
    role: 'Virtual Assistant',
    org: 'Freelance / Remote',
    period: 'June 2019 – 2021',
    items: [
      ['Executive Calendar Management', 'Managed calendars, scheduled meetings, and organized travel for clients.'],
      ['Email & Communication', 'Handled correspondence, filtered messages, and answered inquiries on time.'],
      ['Research & Reporting', 'Researched topics and compiled reports to support decisions.'],
      ['Virtual Meetings', 'Coordinated and facilitated virtual meetings, from video setup to agendas.'],
      ['Social Media Management', 'Scheduled content and monitored engagement.'],
      ['Canva Design & Graphics', 'Created graphics and marketing visuals that strengthened client branding.'],
    ],
  },
];

export const education = [
  { school: 'New Era University', detail: 'Bachelor of Elementary Education', years: '2016 – 2022' },
  { school: 'Mabini Colleges', detail: 'Technical and Vocational Course' },
  { school: 'Eastern Quezon College', detail: 'Basic Education' },
];

export const certifications = [
  {
    title: 'Excel Associate',
    issuer: 'Microsoft Office Specialist',
    text: 'Advanced Excel skills for accurate data organization, formulas, reporting, and tracking.',
  },
  {
    title: 'Management Tips',
    issuer: 'Certification',
    text: 'Time management, organization, and productivity for remote work.',
  },
  {
    title: 'Excel 2016 Essential Training',
    issuer: 'Certification',
    text: 'Functions, formatting, and data handling for clean records and reports.',
  },
];

/** `value` animates from 0; `bar` (0–1) sets the progress line under it. */
export const achievements = [
  {
    value: 10,
    suffix: '+',
    unit: 'hrs',
    label: 'Saved for clients every week',
    text: 'Clients reported major time savings on recurring admin and daily coordination.',
    bar: 1,
  },
  {
    value: 60,
    suffix: '%',
    label: 'More efficient email organization',
    text: 'Faster inbox management, clearer priorities, and consistent follow-through.',
    bar: 0.6,
  },
  {
    value: 50,
    suffix: '%',
    label: 'Less manual work',
    text: 'Streamlined workflows and repeatable processes cut routine admin in half.',
    bar: 0.5,
  },
  {
    value: 95,
    suffix: '%',
    label: 'Of past clients gave 5 stars',
    text: 'Consistently high satisfaction from dependable communication and quality support.',
    bar: 0.95,
  },
];

export const reasons = [
  { icon: 'target', title: 'Detail-Oriented', text: 'Every task gets precision and care, from calendar management to document preparation.' },
  { icon: 'clock', title: 'Efficient', text: 'Handles competing priorities without letting quality slip.' },
  { icon: 'shield', title: 'Reliable', text: '5+ years of consistent remote support for executives and entrepreneurs.' },
  { icon: 'refresh', title: 'Adaptable', text: 'Skilled across admin, technical, sales, and communication work to fit your needs.' },
];

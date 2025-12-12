import { LibraryEvent } from '../types';

// Get a date string X days from today
const getDateFromToday = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const mockEvents: LibraryEvent[] = [
  {
    id: "event_001",
    title: "Mystery Book Club",
    description: "Join us for a lively discussion of 'The Thursday Murder Club' by Richard Osman. Perfect for fans of cozy mysteries!",
    date: getDateFromToday(4),
    time: "18:00",
    duration_minutes: 90,
    location: {
      branch: "Main Branch",
      room: "Community Room"
    },
    event_type: "book_club",
    age_group: "adult",
    capacity: 20,
    registered: 12,
    registration_status: "open",
    facilitator: "Sarah Johnson, Library Staff"
  },
  {
    id: "event_002",
    title: "Toddler Story Time",
    description: "Songs, stories, and fun for children ages 2-4 and their caregivers. No registration required!",
    date: getDateFromToday(6),
    time: "10:30",
    duration_minutes: 30,
    location: {
      branch: "Main Branch",
      room: "Children's Area"
    },
    event_type: "children",
    age_group: "toddler",
    capacity: 25,
    registered: 0,
    registration_status: "drop_in",
    facilitator: undefined
  },
  {
    id: "event_003",
    title: "Introduction to Excel",
    description: "Learn the basics of Microsoft Excel including formulas, formatting, and creating charts. Bring your laptop or use ours.",
    date: getDateFromToday(9),
    time: "14:00",
    duration_minutes: 120,
    location: {
      branch: "Main Branch",
      room: "Computer Lab"
    },
    event_type: "technology",
    age_group: "adult",
    capacity: 12,
    registered: 12,
    registration_status: "full",
    facilitator: "Mike Chen, Technology Specialist"
  },
  {
    id: "event_004",
    title: "Author Talk: Jane Smith",
    description: "Local author Jane Smith discusses her new novel 'The River's Edge' followed by Q&A and book signing.",
    date: getDateFromToday(12),
    time: "19:00",
    duration_minutes: 60,
    location: {
      branch: "Main Branch",
      room: "Auditorium"
    },
    event_type: "author_event",
    age_group: "adult",
    capacity: 100,
    registered: 87,
    registration_status: "open",
    facilitator: "Jane Smith, Author"
  },
  {
    id: "event_005",
    title: "Crafternoon: Fall Decorations",
    description: "Create beautiful autumn decorations using natural materials. All supplies provided. Ages 8+",
    date: getDateFromToday(14),
    time: "15:00",
    duration_minutes: 90,
    location: {
      branch: "West Branch",
      room: "Craft Studio"
    },
    event_type: "workshop",
    age_group: "family",
    capacity: 15,
    registered: 14,
    registration_status: "waitlist",
    facilitator: "Emily Rodriguez, Program Coordinator"
  },
  {
    id: "event_006",
    title: "Chess Club",
    description: "Weekly chess meetup for players of all skill levels. Learn strategies and compete in friendly matches.",
    date: getDateFromToday(17),
    time: "18:30",
    duration_minutes: 120,
    location: {
      branch: "East Branch",
      room: "Meeting Room"
    },
    event_type: "recreation",
    age_group: "all_ages",
    capacity: 20,
    registered: 8,
    registration_status: "open",
    facilitator: undefined
  },
  {
    id: "event_007",
    title: "Teen Anime & Manga Club",
    description: "Discuss your favorite anime and manga, watch new series, and make friends who share your interests!",
    date: getDateFromToday(19),
    time: "16:00",
    duration_minutes: 60,
    location: {
      branch: "Main Branch",
      room: "Teen Lounge"
    },
    event_type: "teen_program",
    age_group: "teen",
    capacity: 20,
    registered: 15,
    registration_status: "open",
    facilitator: undefined
  },
  {
    id: "event_008",
    title: "Local History Lecture Series",
    description: "Explore the fascinating history of our town from 1850-1950. Presented by local historian Dr. Robert Williams.",
    date: getDateFromToday(30),
    time: "18:00",
    duration_minutes: 75,
    location: {
      branch: "Main Branch",
      room: "Auditorium"
    },
    event_type: "lecture",
    age_group: "adult",
    capacity: 50,
    registered: 23,
    registration_status: "open",
    facilitator: "Dr. Robert Williams, Historian"
  },
  {
    id: "event_009",
    title: "Preschool STEM Exploration",
    description: "Hands-on science activities for ages 3-5. This week: exploring magnets! Caregiver participation required.",
    date: getDateFromToday(33),
    time: "10:00",
    duration_minutes: 45,
    location: {
      branch: "West Branch",
      room: "Activity Room"
    },
    event_type: "children",
    age_group: "preschool",
    capacity: 15,
    registered: 10,
    registration_status: "open",
    facilitator: "Amanda Lee, Children's Specialist"
  },
  {
    id: "event_010",
    title: "Knitting Circle",
    description: "Bring your current project or start something new. All skill levels welcome. Share patterns and techniques!",
    date: getDateFromToday(37),
    time: "13:00",
    duration_minutes: 120,
    location: {
      branch: "East Branch",
      room: "Community Space"
    },
    event_type: "craft",
    age_group: "adult",
    capacity: 12,
    registered: 9,
    registration_status: "open",
    facilitator: undefined
  }
];
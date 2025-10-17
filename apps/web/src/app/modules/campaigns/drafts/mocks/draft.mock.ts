/**
 * Mock data for drafts module
 * Provides diverse draft examples for development and testing
 */

import type { Draft } from '../types/draft.types';

export const mockDrafts: Draft[] = [
  {
    id: 'draft-1',
    title: 'Spring Sale Announcement - Facebook',
    body: '🌸 Spring Sale is here! Get 30% off on all products. Limited time offer. Shop now and enjoy the best deals of the season! #SpringSale #Discount',
    channel: 'facebook',
    status: 'draft',
    owner: {
      id: 'user-1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    campaign: {
      id: 'camp-1',
      name: 'Spring 2025 Campaign',
      status: 'active',
    },
    media: [
      {
        id: 'media-1',
        type: 'image',
        url: 'https://picsum.photos/800/600?random=1',
        thumbnail: 'https://picsum.photos/200/150?random=1',
        size: 245000,
        name: 'spring-sale-banner.jpg',
      },
    ],
    tags: ['sale', 'spring', 'promotion'],
    createdAt: '2025-10-15T10:30:00Z',
    updatedAt: '2025-10-17T08:15:00Z',
    lastEditedAt: '2025-10-17T08:15:00Z',
    lastEditedBy: 'Sarah Johnson',
    version: 3,
  },
  {
    id: 'draft-2',
    title: 'Product Launch Teaser',
    body: 'Something exciting is coming... 👀 Stay tuned for our biggest product launch this year! #ComingSoon #NewProduct',
    channel: 'instagram',
    status: 'auto-saved',
    owner: {
      id: 'user-2',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    media: [
      {
        id: 'media-2',
        type: 'video',
        url: 'https://example.com/teaser.mp4',
        thumbnail: 'https://picsum.photos/200/150?random=2',
        size: 5200000,
        name: 'product-teaser.mp4',
      },
    ],
    tags: ['launch', 'teaser', 'product'],
    scheduledFor: '2025-10-20T12:00:00Z',
    createdAt: '2025-10-16T14:20:00Z',
    updatedAt: '2025-10-17T09:45:00Z',
    lastEditedAt: '2025-10-17T09:45:00Z',
    lastEditedBy: 'Michael Chen',
    autoSavedAt: '2025-10-17T09:45:00Z',
    version: 5,
  },
  {
    id: 'draft-3',
    title: 'LinkedIn Company Update',
    body: 'Excited to announce our Q3 results! We have achieved 150% growth this quarter. Thank you to our amazing team and loyal customers. #CompanyNews #Growth',
    channel: 'linkedin',
    status: 'draft',
    owner: {
      id: 'user-3',
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    media: [],
    tags: ['company-update', 'results', 'growth'],
    createdAt: '2025-10-14T09:00:00Z',
    updatedAt: '2025-10-14T09:00:00Z',
    lastEditedAt: '2025-10-14T09:00:00Z',
    lastEditedBy: 'Emily Rodriguez',
    version: 1,
  },
  {
    id: 'draft-4',
    title: 'Twitter Thread - Industry Tips',
    body: '🧵 Thread: 5 Tips for Better Social Media Engagement\n\n1/ Post consistently at optimal times\n2/ Use high-quality visuals\n3/ Engage with your audience\n4/ Use relevant hashtags\n5/ Analyze your metrics',
    channel: 'twitter',
    status: 'draft',
    owner: {
      id: 'user-1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    campaign: {
      id: 'camp-2',
      name: 'Content Marketing Q4',
      status: 'active',
    },
    media: [],
    tags: ['tips', 'engagement', 'thread'],
    createdAt: '2025-10-13T16:30:00Z',
    updatedAt: '2025-10-16T11:20:00Z',
    lastEditedAt: '2025-10-16T11:20:00Z',
    lastEditedBy: 'Sarah Johnson',
    version: 4,
  },
  {
    id: 'draft-5',
    title: 'Google Ads - Holiday Campaign',
    body: 'Premium Quality Products | Free Shipping | 24/7 Support\n\nShop the best holiday deals now! Limited time offer - Up to 50% off selected items.',
    channel: 'google-ads',
    status: 'scheduled',
    owner: {
      id: 'user-4',
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    campaign: {
      id: 'camp-3',
      name: 'Holiday 2025',
      status: 'active',
    },
    media: [
      {
        id: 'media-3',
        type: 'image',
        url: 'https://picsum.photos/800/600?random=3',
        thumbnail: 'https://picsum.photos/200/150?random=3',
        size: 180000,
        name: 'holiday-ad.jpg',
      },
    ],
    tags: ['google-ads', 'holiday', 'campaign'],
    scheduledFor: '2025-11-01T00:00:00Z',
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-15T14:30:00Z',
    lastEditedAt: '2025-10-15T14:30:00Z',
    lastEditedBy: 'David Kim',
    version: 8,
  },
  {
    id: 'draft-6',
    title: 'Email Newsletter - October',
    body: 'Hi [First Name],\n\nWelcome to our October newsletter! Here are the highlights this month:\n\n• New product launches\n• Exclusive member discounts\n• Upcoming events\n\nBest regards,\nThe Team',
    channel: 'email',
    status: 'draft',
    owner: {
      id: 'user-5',
      name: 'Lisa Anderson',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    media: [],
    tags: ['newsletter', 'email', 'monthly'],
    createdAt: '2025-10-12T08:00:00Z',
    updatedAt: '2025-10-17T07:30:00Z',
    lastEditedAt: '2025-10-17T07:30:00Z',
    lastEditedBy: 'Lisa Anderson',
    version: 6,
  },
  {
    id: 'draft-7',
    title: 'Instagram Story - Behind the Scenes',
    body: '📸 BTS from our latest photoshoot! Swipe to see more ➡️',
    channel: 'instagram',
    status: 'auto-saved',
    owner: {
      id: 'user-2',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    media: [
      {
        id: 'media-4',
        type: 'image',
        url: 'https://picsum.photos/800/600?random=4',
        thumbnail: 'https://picsum.photos/200/150?random=4',
        size: 320000,
        name: 'bts-1.jpg',
      },
      {
        id: 'media-5',
        type: 'image',
        url: 'https://picsum.photos/800/600?random=5',
        thumbnail: 'https://picsum.photos/200/150?random=5',
        size: 295000,
        name: 'bts-2.jpg',
      },
    ],
    tags: ['bts', 'story', 'photoshoot'],
    createdAt: '2025-10-17T06:00:00Z',
    updatedAt: '2025-10-17T10:30:00Z',
    lastEditedAt: '2025-10-17T10:30:00Z',
    lastEditedBy: 'Michael Chen',
    autoSavedAt: '2025-10-17T10:30:00Z',
    version: 2,
  },
  {
    id: 'draft-8',
    title: 'Facebook Event Promotion',
    body: '🎉 Join us for our Virtual Conference 2025!\n\nDate: November 15, 2025\nTime: 10:00 AM - 4:00 PM\n\nRegister now for early bird pricing! Limited spots available.',
    channel: 'facebook',
    status: 'draft',
    owner: {
      id: 'user-3',
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    campaign: {
      id: 'camp-4',
      name: 'Virtual Conference 2025',
      status: 'active',
    },
    media: [
      {
        id: 'media-6',
        type: 'image',
        url: 'https://picsum.photos/800/600?random=6',
        thumbnail: 'https://picsum.photos/200/150?random=6',
        size: 410000,
        name: 'conference-poster.jpg',
      },
    ],
    tags: ['event', 'conference', 'registration'],
    scheduledFor: '2025-10-25T09:00:00Z',
    createdAt: '2025-10-11T13:00:00Z',
    updatedAt: '2025-10-16T15:45:00Z',
    lastEditedAt: '2025-10-16T15:45:00Z',
    lastEditedBy: 'Emily Rodriguez',
    version: 7,
  },
  {
    id: 'draft-9',
    title: 'LinkedIn Job Posting',
    body: 'We are hiring! 🚀\n\nPosition: Senior Marketing Manager\nLocation: Remote/Hybrid\n\nWe are looking for a talented marketing professional to join our growing team. Apply now!',
    channel: 'linkedin',
    status: 'draft',
    owner: {
      id: 'user-4',
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    media: [],
    tags: ['hiring', 'job-posting', 'recruitment'],
    createdAt: '2025-10-09T11:00:00Z',
    updatedAt: '2025-10-09T11:00:00Z',
    lastEditedAt: '2025-10-09T11:00:00Z',
    lastEditedBy: 'David Kim',
    version: 1,
  },
  {
    id: 'draft-10',
    title: 'Twitter Poll - Customer Feedback',
    body: '❓ Quick poll: Which feature would you like us to add next?\n\n• Dark mode\n• Mobile app\n• Advanced analytics\n• Integration with more tools\n\nVote below! 👇',
    channel: 'twitter',
    status: 'auto-saved',
    owner: {
      id: 'user-5',
      name: 'Lisa Anderson',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    media: [],
    tags: ['poll', 'feedback', 'engagement'],
    createdAt: '2025-10-08T14:30:00Z',
    updatedAt: '2025-10-17T09:00:00Z',
    lastEditedAt: '2025-10-17T09:00:00Z',
    lastEditedBy: 'Lisa Anderson',
    autoSavedAt: '2025-10-17T09:00:00Z',
    version: 4,
  },
];

/**
 * Get drafts with optional filters
 */
export function getMockDrafts(filters?: {
  channel?: string;
  status?: string;
  search?: string;
}): Draft[] {
  let filtered = [...mockDrafts];

  if (filters?.channel) {
    filtered = filtered.filter((d) => d.channel === filters.channel);
  }

  if (filters?.status) {
    filtered = filtered.filter((d) => d.status === filters.status);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (d) => d.title.toLowerCase().includes(search) || d.body.toLowerCase().includes(search)
    );
  }

  return filtered;
}

/**
 * Get draft by ID
 */
export function getMockDraftById(id: string): Draft | undefined {
  return mockDrafts.find((d) => d.id === id);
}

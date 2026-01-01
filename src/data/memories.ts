export interface Memory {
  id: string;
  type: 'photo' | 'note' | 'ticket' | 'postcard';
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl?: string;
  rotation?: number;
}

export const memories: Memory[] = [
  {
    id: '1',
    type: 'photo',
    title: 'Sunset in Santorini',
    date: 'June 2023',
    location: 'Santorini, Greece',
    description: 'The most magical sunset I\'ve ever witnessed. The sky turned into watercolors.',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
    rotation: -3,
  },
  {
    id: '2',
    type: 'note',
    title: 'A moment of clarity',
    date: 'July 2023',
    location: 'Kyoto, Japan',
    description: 'Sitting in the bamboo grove, I finally understood what stillness means. The rustling leaves spoke louder than any words.',
    rotation: 2,
  },
  {
    id: '3',
    type: 'postcard',
    title: 'Greetings from Paris',
    date: 'April 2023',
    location: 'Paris, France',
    description: 'The city of lights exceeded every expectation. Even the rain was romantic.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    rotation: -2,
  },
  {
    id: '4',
    type: 'ticket',
    title: 'Train to Machu Picchu',
    date: 'August 2023',
    location: 'Peru',
    description: 'Ticket stub from the journey to the ancient citadel. Worth every winding turn.',
    rotation: 4,
  },
  {
    id: '5',
    type: 'photo',
    title: 'Northern Lights',
    date: 'February 2024',
    location: 'Tromsø, Norway',
    description: 'Nature\'s own light show. Dancing greens and purples across the Arctic sky.',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop',
    rotation: -1,
  },
  {
    id: '6',
    type: 'note',
    title: 'Coffee in Vienna',
    date: 'March 2024',
    location: 'Vienna, Austria',
    description: 'The art of sitting still. A melange and a slice of Sachertorte. Hours passed like minutes.',
    rotation: 3,
  },
  {
    id: '7',
    type: 'photo',
    title: 'Desert Stars',
    date: 'November 2023',
    location: 'Sahara Desert, Morocco',
    description: 'Sleeping under a blanket of stars. The Milky Way was our ceiling.',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
    rotation: -2,
  },
  {
    id: '8',
    type: 'postcard',
    title: 'Floating Markets',
    date: 'December 2023',
    location: 'Bangkok, Thailand',
    description: 'The chaos was beautiful. Colors, sounds, and the sweetest mangoes.',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop',
    rotation: 1,
  },
];


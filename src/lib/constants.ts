export const SITE_CONFIG = {
  name: 'Ganesh Prasad Bhatt',
  shortName: 'Ganesh',
  title: 'Senior Full-Stack Engineer · WordPress, Gutenberg, React, PHP',
  description:
    'Ganesh Prasad Bhatt is a senior full-stack engineer in Kathmandu, Nepal, working across WordPress, Gutenberg, React and PHP. Selected work includes Spectra, Masteriyo LMS and WP Agent AI.',
  url: 'https://www.ganeshbhatt.com.np',
  email: 'bhattaganesh05@gmail.com',
  location: 'Kathmandu, Nepal',
  socials: {
    linkedin: 'https://www.linkedin.com/in/ganesh-bhatta/',
    github: 'https://github.com/bhattaganesh',
    facebook: 'https://www.facebook.com/ganesh.bhatta.gb',
  },
} as const;

/** Primary navigation. Notes joins this list once an article is approved for publication. */
export const NAV_ITEMS = [
  { label: 'Work', href: '/work/' },
  { label: 'Journey', href: '/journey/' },
  { label: 'Contact', href: '/contact/' },
] as const;

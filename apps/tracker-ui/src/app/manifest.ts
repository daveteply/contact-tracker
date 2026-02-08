import type { MetadataRoute } from 'next';
import iconData from '../../public/icons.json';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Job Seeker Tracker',
    short_name: 'JobSeeker',
    description:
      'Manage and track your applications and contacts while seeking the role of your dreams!',
    start_url: '/',
    display: 'standalone',
    // daisyUI default light "base-100" is #ffffff
    background_color: '#ffffff',
    // daisyUI default light "primary" is #570df8
    theme_color: '#570df8',
    icons: iconData.icons.map((icon) => ({
      ...icon,
      src: `/${icon.src}`,
      screenshots: [
        {
          src: '/screenshots/desktop-home.png', // Save a 1280x720 image in public/screenshots/
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide',
          label: 'Desktop Homepage',
        },
        {
          src: '/screenshots/mobile-home.png', // Save a 720x1280 image in public/screenshots/
          sizes: '720x1280',
          type: 'image/png',
          label: 'Mobile Homepage',
        },
      ],
    })),
  };
}

# Web Video Editor

A browser-based video editing tool built with Next.js, TypeScript, and Fabric.js that allows users to create and edit videos directly in their web browser.

Live Deploy: [Vercel Link](https://web-video-editor-nine.vercel.app/)

## Features

- Upload and manage media files (images, videos)
- Canvas-based editing interface
- Timeline control for video positioning
- Media controls for size and position adjustments
- Playback controls (play, pause, seek)
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Canvas Library**: Fabric.js
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/web-video-editor.git
cd web-video-editor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Project Structure

```
src/
  ├── app/           # Next.js app router pages
  ├── components/    # React components
  ├── hooks/         # Custom React hooks
  └── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

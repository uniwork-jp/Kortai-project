# AI Assistant Frontend

A modern Next.js 15 application built with the App Router, TypeScript, and Tailwind CSS.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint** for code quality
- **Server Components** for optimal performance
- **Responsive Design** with mobile-first approach

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3001`.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts

## Project Structure

```
app/
├── app/                 # App Router directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── about/          # About page route
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── lib/               # Utility functions
├── public/            # Static assets
├── next.config.js     # Next.js configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## App Router

This project uses Next.js App Router, which provides:

- **File-based routing** with the `app` directory
- **Server Components** by default
- **Nested layouts** for shared UI
- **Loading states** with `loading.tsx`
- **Error boundaries** with `error.tsx`
- **Route groups** for organization
- **Parallel routes** for complex layouts

## Development

### Adding New Pages

Create a new directory in `app/` with a `page.tsx` file:

```
app/
└── new-page/
    └── page.tsx
```

### Adding Components

Create reusable components in the `components/` directory:

```tsx
// components/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  )
}
```

### Styling

This project uses Tailwind CSS for styling. You can:

- Use utility classes directly in JSX
- Create custom components with Tailwind
- Extend the theme in `tailwind.config.js`
- Add custom CSS in `globals.css`

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Docker**

For production builds:

```bash
pnpm build
pnpm start
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new files
3. Write meaningful commit messages
4. Test your changes thoroughly
5. Update documentation as needed

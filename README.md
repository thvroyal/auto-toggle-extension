# Auto Toggle Extensions

![image]("./public/icon128.png")

A Chrome extension to boost productivity by managing and organizing browser extensions.

## Features

- Group extensions for easy management
- Toggle extensions on/off with a single click
- Create custom groups for different workflows
- Intuitive user interface with drag-and-drop functionality

## Tech Stack

- TypeScript
- React
- Webpack
- Tailwind CSS
- shadcn/ui components

## Project Structure

- `src/`: TypeScript source files
- `public/`: Static files
- `dist/`: Chrome Extension directory (generated)

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run watch
```

## Build

Create a production build:

```bash
npm run build
```

## Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` directory in the project folder

## Testing

Run tests:

```bash
npm run test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

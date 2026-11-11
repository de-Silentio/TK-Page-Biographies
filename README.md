# Historical Biographies Archive

A self-standing web application featuring 44 unabridged historical biographies with authentic portrait images, responsive reading views, and full verbatim document records.

---

## Why did "Loading failed for the module with source ... /src/main.tsx" occur?

When deploying a React + Vite TypeScript project to GitHub Pages:
- The browser cannot run TypeScript/JSX files (`.tsx`) directly.
- In development, Vite compiles `.tsx` on the fly.
- For production, Vite compiles the app into pure HTML/CSS/JS in the `dist/` directory via `npm run build`.
- If GitHub Pages is set to deploy from the `main` branch root `/`, GitHub Pages serves the uncompiled development `index.html` referencing `/src/main.tsx`, which causes the browser error:
  `Loading failed for the module with source "https://de-silentio.github.io/src/main.tsx"`.

---

## How to Fix and Deploy (Choose Option 1 or 2)

### Option 1: Automatic Deployment with GitHub Actions (Recommended)

A workflow file (`.github/workflows/deploy.yml`) is already included in this repository.

1. Go to your GitHub repository in your browser: `https://github.com/de-silentio/<repository-name>`.
2. Click **Settings** (top tab of your repo).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** -> **Source**, change from **"Deploy from a branch"** to **"GitHub Actions"**.
5. Push your code to GitHub (or trigger the workflow manually under the **Actions** tab -> **Deploy to GitHub Pages** -> **Run workflow**).
6. GitHub Actions will automatically install dependencies, run `npm run build`, and deploy the compiled `dist/` folder to `https://de-silentio.github.io/`.

---

### Option 2: Deploying the `dist` Folder Directly (Deploy from branch)

If you prefer using the branch-based deployment:

1. Run the production build locally:
   ```bash
   npm run build
   ```
2. Deploy the generated `dist/` directory to a `gh-pages` branch or configure your deployment to use `dist/`.

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

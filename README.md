# HOMEfit-preview

Public preview deployment of the HOMEfit home workout app.

The application is built with React, Vite and Tailwind CSS and is deployed
automatically to GitHub Pages on pushes to `main`.

## Exercise media

The exercise library is enriched with the metadata and remote male/female demo videos from
[Free Exercise DB with Videos](https://github.com/harshvishu/free-exercise-db-with-videos),
licensed under MIT. The full catalog is bundled in `src/data/free-exercise-db.json`; video files
remain served from the source project's CDN so the application does not ship hundreds of large MP4s.

# Image Storage Server

A simple nodejs server with express and typescript for resizing and storing images.

## Steps for use

1. Clone the repository.
2. Create `.env` file according `.templete.env` file and change it to your needs.
3. Installs dependencies`npm install`.
4. Run with `npm run dev`.
5. Enjoy :D

## Project Structure

```
└── 📁src
    └── 📁config
        └── server.ts
    └── 📁enums
        └── valid-paths.ts
    └── 📁images
        └── 📁controllers
            └── images.controller.ts
        └── 📁daos
            └── images.dao.ts
        └── 📁routes
            └── images.routes.ts
    └── 📁utilities
        └── size-options.ts
    └── index.ts
```

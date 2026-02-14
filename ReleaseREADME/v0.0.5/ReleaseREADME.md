# v1.0.1 - Mobile UX and Download Reliability Update

Released on **February 14, 2026**

This release focuses on playback reliability, mobile usability, and UI polish across the app.

## What�s New
- Improved end-to-end listening experience across Home, Favorites, Albums, Artists, and Playlists.
- Enhanced sidebar player with queue management, multi-select actions, and smoother interaction patterns.
- Better mobile experience with responsive layouts and mini-player flow improvements.
- Favorites remain persistent via local storage for songs, artists, albums, and playlists.

## Fixes & Improvements
- Fixed **song download issues in React Native WebView**.
- Fixed additional song download stability issues in browser/WebView flows.
- Resolved **mobile infinite scroll** issues in content listing/search sections.
- Improved image rendering behavior by using unoptimized loading fallback where needed.
- Fixed font/style inconsistencies and applied broader visual polish updates.

## Platform/Stack
- Next.js 16 + React 19
- NextAuth (credentials-based auth)
- Prisma + PostgreSQL
- Tailwind CSS + Ant Design

## Full Changelog (latest commits)
- `3d1ef61` Song Download Issue is Fixed for the React-Native WebView
- `502e5f2` download issue fixed
- `14223b4` UI Style changes are done.
- `4fbb2da` unoptimized images loading due to the payment issue for the optimized images
- `5e5851a` font Style Issue fixing
- `12434dc` style update
- `162622b` style changes
- `0b24251` style changes

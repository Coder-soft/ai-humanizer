# AI Code Review Suggestions

This PR implements 2 suggestions from the AI code review:

1. **File:** next.config.ts
   **Line:** 3
   **Change:** Adding security headers improves the application's security posture by preventing clickjacking (X-Frame-Options), MIME type sniffing (X-Content-Type-Options), and controlling referrer information (Referrer-Policy). These are essential security best practices for web applications.

2. **File:** public/robots.txt
   **Line:** 1
   **Change:** Adding a robots.txt file helps search engine crawlers understand which parts of your site should not be indexed. Disallowing the /api/ path prevents sensitive endpoints from being indexed, and providing a sitemap location helps with SEO.


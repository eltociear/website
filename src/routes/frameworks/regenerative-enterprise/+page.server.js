// src/routes/frameworks/regenerative-enterprise/+page.server.js
import { redirect } from '@sveltejs/kit';

export const prerender = true; // Add this line

export async function load() {
  throw redirect(301, '/frameworks/pathfinder-protocol');
}

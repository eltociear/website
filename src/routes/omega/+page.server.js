// src/routes/omega/+page.server.js
import { redirect } from '@sveltejs/kit';

export async function load() {
  throw redirect(301, '/resources/whitepapers/omega-proof');
}

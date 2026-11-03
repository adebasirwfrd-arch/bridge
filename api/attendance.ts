export const config = { runtime: "edge" };

/**
 * Attendees only ever talk to this domain. Every request is forwarded server-side to Notesy, which stores the
 * sign-ins where the organizer's Notesy app picks them up, so networks that block the Notesy domain still work.
 */
const NOTESY = process.env.NOTESY_ORIGIN || "https://notesy-three.vercel.app";

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  if (!["GET", "POST"].includes(req.method)) return new Response(JSON.stringify({ message: "Metode tidak didukung." }), { status: 405 });
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  // Only the attendee side (read meeting info, sign in) is exposed; organizer requests use a secret key and go to Notesy directly.
  if (!/^[A-Za-z0-9_-]{22}$/.test(id)) return new Response(JSON.stringify({ message: "Link absensi tidak valid." }), { status: 400 });
  let res: Response;
  try {
    res = await fetch(`${NOTESY}/api/attendance?id=${id}`, {
      method: req.method,
      headers: { "content-type": req.headers.get("content-type") ?? "application/json" },
      body: req.method === "POST" ? await req.text() : undefined,
    });
  } catch {
    return new Response(JSON.stringify({ message: "Server sedang sibuk. Coba kirim lagi." }), { status: 503 });
  }
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

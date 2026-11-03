# bridge

Formulir absensi MoM untuk peserta rapat. Peserta membuka link/QR dari Notesy, mengisi data diri (dan tanda tangan bila diminta), lalu data diteruskan ke server Notesy dan otomatis masuk ke daftar hadir MoM.

- `index.html`, `src/`: formulir (`/?i=<id>`).
- `api/attendance.ts`: perantara ke `NOTESY_ORIGIN` (bawaan `https://notesy-three.vercel.app`). Hanya sisi peserta yang diteruskan.

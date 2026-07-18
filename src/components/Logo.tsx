import Image from "next/image";

// Swapped from the lettermark placeholder to a real image. The file must
// live at automom/public/logo.png — Next.js serves anything in /public
// directly from the site root, so "/logo.png" here maps to that file.
export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Automom logo"
      width={32}
      height={32}
      className="rounded-full object-cover"
      priority
    />
  );
}

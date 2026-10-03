import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="PRD Generator — beranda">
      <span className="logo-mark" aria-hidden="true" />
      <span>PRD Generator</span>
    </Link>
  );
}

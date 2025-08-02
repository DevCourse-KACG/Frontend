import Link from "next/link";

interface ShortcutLinkProps {
  label: string;
  href: string;
}

export function ShortcutLink({ label, href }: ShortcutLinkProps) {
  return (
    <Link href={href}>
      <div className="p-4 rounded-xl shadow hover:bg-gray-100 transition bg-white text-center text-sm font-medium">
        {label}
      </div>
    </Link>
  );
}

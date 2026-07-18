export function Footer() {
  return (
    <footer className="border-t border-slate-100 py-6 text-center dark:border-slate-800">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} Automom. All rights reserved.
      </p>
    </footer>
  );
}

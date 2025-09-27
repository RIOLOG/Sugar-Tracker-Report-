// src/components/Footer.js

export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 text-center text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Sugar Tracker | Built with care for my father by Ankit Singh.
          </p>
        </div>
      </div>
    </footer>
  );
}
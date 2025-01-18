import Link from "next/link";

// Header component
export default function Header() {
  return (
    <header className="sticky top-0 bg-header shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-orange">
          <Link href="/">Timetable AI</Link>
        </h1>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/features" className="text-orange hover:text-white">
            Features
          </Link>
          <Link href="/generate" className="text-orange hover:text-white">
            Generate
          </Link>
          <Link href="/about" className="text-orange hover:text-white">
            About
          </Link>
        </nav>

        {/* Get Started Button */}
        <Link
          href="/get-started"
          className="bg-header text-orange px-4 py-2 rounded-md hover:bg-orange hover:text-white border-2 border-orange"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

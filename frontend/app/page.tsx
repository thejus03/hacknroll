"use client";
import { useState } from "react";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa";

export default function LandingPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen bg-mainbg text-white flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 text-center">
        <h1 className="text-5xl font-bold text-orange leading-tight animate-fade-in">
          Simplify Your Scheduling <br /> With AI
        </h1>
        <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
          Manage your time effectively with automated schedules tailored to your
          needs. Let AI handle the stress of planning!
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link href="/generate">
            <button className="bg-orange text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-all duration-300 shadow-lg">
              Generate Timetable
            </button>
          </Link>
          <Link href="/about">
            <button className="bg-header text-orange px-6 py-3 rounded-md hover:bg-orange hover:text-white transition-all duration-300 shadow-lg border border-orange">
              Learn More
            </button>
          </Link>
        </div>

        <div className="text-sm text-gray-300 mt-6 animate-pulse">
          Ready to make scheduling easy? Start now!
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-20 bg-header text-center flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-orange mb-6">
          Why Choose Timetable AI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
          <div className="bg-mainbg p-6 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-orange">AI-Powered</h3>
            <p className="mt-4 text-gray-300">
              Advanced algorithms ensure you always have the best schedule for
              your goals.
            </p>
          </div>
          <div className="bg-mainbg p-6 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-orange">Customizable</h3>
            <p className="mt-4 text-gray-300">
              Tailor your schedules to fit your preferences with ease.
            </p>
          </div>
          <div className="bg-mainbg p-6 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-orange">Easy to Use</h3>
            <p className="mt-4 text-gray-300">
              Intuitive interface designed for everyone—no learning curve.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="w-full py-20 bg-mainbg text-center flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-orange mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-10 md:space-y-0 md:space-x-10">
          <div className="p-6 bg-header shadow-lg rounded-md max-w-sm transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-orange">Step 1</h3>
            <p className="mt-4 text-gray-300">
              Input your tasks, preferences, and available time.
            </p>
          </div>
          <div className="p-6 bg-header shadow-lg rounded-md max-w-sm transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-orange">Step 2</h3>
            <p className="mt-4 text-gray-300">
              Let Timetable AI generate optimized schedules.
            </p>
          </div>
          <div className="p-6 bg-header shadow-lg rounded-md max-w-sm transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-orange">Step 3</h3>
            <p className="mt-4 text-gray-300">
              Enjoy stress-free planning with your perfect timetable!
            </p>
          </div>
        </div>
        <div className="mt-10">
          <FaArrowDown className="text-orange text-3xl animate-bounce" />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-20 bg-header text-center">
        <h2 className="text-3xl font-bold text-orange">Get in Touch</h2>
        <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
          Have questions or need support? We're here to help!{" "}
          <a
            href="mailto:support@timetableai.com"
            className="text-orange hover:underline"
          >
            Contact us
          </a>{" "}
          today.
        </p>
      </section>
    </div>
  );
}

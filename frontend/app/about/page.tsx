export default function About() {
    return (
      <div className="min-h-screen bg-mainbg p-8 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-5xl font-bold text-orange border-b-4 border-orange pb-4 text-center">
          About Us
        </h1>
  
        {/* Intro Text */}
        <p className="mt-6 text-xl text-gray-300 text-center max-w-4xl">
          Welcome to your ultimate companion for seamless timetable planning! We integrate
          directly with <span className="text-orange font-bold">NUSMods</span> to make academic
          scheduling simple, smart, and stress-free.
        </p>
  
        {/* Features Section */}
        <div className="mt-10 bg-header shadow-md rounded-md p-8 w-full max-w-5xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold text-orange text-center">What We Offer</h2>
          <p className="mt-6 text-gray-300 text-center">
            Our platform provides a smart, personalized experience tailored to your preferences:
          </p>
          <ul className="mt-4 space-y-4 text-gray-300 list-disc list-inside text-left sm:text-center">
            <li>
              <span className="text-orange font-bold">Smart Timetable Generator:</span> Automatically
              create optimized schedules that suit your lifestyle.
            </li>
            <li>
              <span className="text-orange font-bold">Personalization:</span> Prioritize free days,
              minimize early mornings, or adjust based on your unique needs.
            </li>
            <li>
              <span className="text-orange font-bold">Efficiency:</span> Save time and reduce stress
              with an intuitive and user-friendly interface.
            </li>
          </ul>
        </div>
  
        {/* Mission Section */}
        <div className="mt-10 bg-header shadow-md rounded-md p-8 w-full max-w-5xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold text-orange text-center">Our Mission</h2>
          <p className="mt-6 text-gray-300 text-center">
            We are dedicated to simplifying the way you select and organize your modules, ensuring
            you can focus on what truly matters — your academic journey and personal growth.
          </p>
        </div>
  
        {/* Vision Section */}
        <div className="mt-10 bg-header shadow-md rounded-md p-8 w-full max-w-5xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold text-orange text-center">Our Vision</h2>
          <p className="mt-6 text-gray-300 text-center">
            To be the leading platform for personalized and efficient scheduling, empowering NUS
            students to take control of their time with confidence and ease.
          </p>
        </div>
  
        {/* Closing Statement */}
        <div className="mt-10 bg-header shadow-md rounded-md p-8 w-full max-w-5xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold text-orange text-center">
            Your Time Matters
          </h2>
          <p className="mt-6 text-gray-300 text-center">
            Let us help you make the most of it. Explore the smarter, simpler way to plan your
            academic life with our platform.
          </p>
        </div>
      </div>
    );
  }
  
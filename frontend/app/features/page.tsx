export default function About() {
    return (
      <div className="min-h-screen bg-mainbg p-8 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-bold text-orange border-b-4 border-orange pb-2">
          About Us
        </h1>
  
        {/* Intro Text */}
        <p className="mt-6 text-lg text-gray-300 text-center max-w-3xl">
          Welcome to the About page of our website. Discover more about what we do
          and how we aim to provide the best experience for you.
        </p>
  
        {/* Mission Section */}
        <div className="mt-10 bg-header shadow-md rounded-md p-6 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-orange text-center">
            Our Mission
          </h2>
          <p className="mt-4 text-gray-300 text-center">
            To empower users with intelligent tools to create and manage their
            timetables effortlessly.
          </p>
        </div>
  
        {/* Vision Section */}
        <div className="mt-6 bg-header shadow-md rounded-md p-6 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-orange text-center">
            Our Vision
          </h2>
          <p className="mt-4 text-gray-300 text-center">
            To be the leading platform for personalized and efficient scheduling.
          </p>
        </div>
      </div>
    );
  }
  
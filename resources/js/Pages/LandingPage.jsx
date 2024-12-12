import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>CustomTickets.ai - Create Stunning Event Tickets</title>
        <meta name="description" content="Use our AI-powered image generator to design unique and eye-catching tickets for your events." />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-orange-100">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6 text-sky-900">
              Create Stunning Custom Event Tickets
            </h1>
            <p className="text-xl mb-8 text-sky-800">
              Use our AI-powered image generator to design unique and eye-catching tickets for your events.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-orange-500 hover:to-orange-600 transition"
              >
                Start Designing Now
              </Link>
              <Link
                href="#features"
                className="bg-sky-900 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-sky-800 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center text-sky-900">
              Why Choose CustomTickets.ai?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="AI-Powered Designs"
                description="Our advanced AI generates unique ticket designs based on your preferences."
                icon="🎨"
              />
              <FeatureCard
                title="Customizable Templates"
                description="Start with our templates and customize them to fit your event's theme."
                icon="✏️"
              />
              <FeatureCard
                title="Instant Downloads"
                description="Generate and download your tickets instantly, ready for distribution."
                icon="⚡"
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="cta" className="py-20 bg-sky-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Create Your Custom Tickets?
            </h2>
            <p className="text-xl mb-8 text-white">
              Join thousands of event organizers who trust CustomTickets.ai for their ticket designs.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/register"
                className="bg-white text-sky-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-orange-100 transition"
              >
                Sign Up Now
              </Link>
              <Link
                href="/login"
                className="bg-orange-400 text-sky-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-orange-300 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-sky-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2023 CustomTickets.ai. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-gradient-to-br from-sky-100 to-orange-100 p-6 rounded-lg shadow-md">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 text-sky-900">{title}</h3>
      <p className="text-sky-800">{description}</p>
    </div>
  );
};

export default LandingPage;


import React, { useState } from 'react';
import { Menu, X, ChevronRight, ArrowRight, Ticket, Sparkles, Download, Share2, Palette, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-sky-900">Ticket°</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-sky-900">Features</a>
            <a href="#templates" className="text-gray-600 hover:text-sky-900">Templates</a>
            <a href="#examples" className="text-gray-600 hover:text-sky-900">Examples</a>
            <a href="#pricing" className="text-gray-600 hover:text-sky-900">Pricing</a>
            <button className="text-gray-600 hover:text-sky-900 font-medium">Sign in</button>
            <button className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors">
              Register
            </button>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
    {/* Video Background */}
    <div className="absolute inset-0 w-full h-full z-0">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="object-cover w-full h-full"
      >
        <source src="/videos/test.mp4" type="video/mp4" />
      </video>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/95 to-orange-50/95" />
    </div>
    
    {/* Content */}
    <div className="relative z-10 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-sky-900 mb-6">
          Create memorable digital tickets
        </h1>
        <p className="text-xl md:text-2xl text-sky-800 max-w-3xl mx-auto mb-10">
          Transform your events with AI-powered custom tickets. Design unique digital memorabilia that your guests will treasure forever.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-sky-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-sky-800 transition-all hover:scale-105 group shadow-lg shadow-sky-900/10">
            Create your first ticket
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-orange-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-500 transition-all group">
            View templates
            <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ... (rest of the components remain the same)

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group">
    <div className="w-12 h-12 bg-gradient-to-br from-sky-900 to-sky-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-sky-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => (
  <div className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-sky-900">Smart ticket creation</h2>
        <p className="text-gray-600 mt-4">AI-powered features to help you create unique, secure digital tickets</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Sparkles}
          title="AI Design Assistant"
          description="Let our AI help you create stunning ticket designs based on your event theme and preferences."
        />
        <FeatureCard 
          icon={Palette}
          title="Custom Templates"
          description="Choose from hundreds of professional templates or create your own unique design from scratch."
        />
        <FeatureCard 
          icon={Shield}
          title="Secure & Verifiable"
          description="Each ticket includes unique verification features to prevent counterfeiting."
        />
        <FeatureCard 
          icon={Download}
          title="Easy Download"
          description="Download your tickets in multiple formats for digital or print distribution."
        />
        <FeatureCard 
          icon={Share2}
          title="Instant Sharing"
          description="Share tickets directly with attendees via email or messaging apps."
        />
        <FeatureCard 
          icon={Ticket}
          title="Digital Collectibles"
          description="Create lasting memorabilia that attendees can keep in their digital wallet."
        />
      </div>
    </div>
  </div>
);

const CallToAction = () => (
  <div className="bg-gradient-to-br from-sky-900 to-sky-800 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl font-bold mb-6">Ready to create amazing tickets?</h2>
      <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
        Join thousands of event organizers creating unforgettable digital experiences.
      </p>
      <button className="bg-orange-400 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-500 transition-all group shadow-lg shadow-black/10">
        Start creating for free
        <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

const LandingPage = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <Hero />
    <Features />
    <CallToAction />
  </div>
);

export default LandingPage;

"use client";

import React from 'react';
import { Share2, Lock, MessageSquareQuote, UserPlus } from 'lucide-react';

// Main component for the About Page
export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Background Gradient Shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[60vw] h-[60vw] bg-blue-900/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-x-hidden">
        {/* Hero Section */}
        <section
          className="text-center mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Where Honesty
            <span className="animate-text-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Finds a Voice</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            Our platform provides a secure and anonymous space for you to receive candid feedback, helping you understand perceptions and foster genuine growth.
          </p>
          <div>
             <a href="/sign-up" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full mt-10 text-lg transition-all duration-300 shadow-lg shadow-indigo-600/30">
                Get Your Feedback Link
              </a>
          </div>
        </section>

      
        <section className="mb-32">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works in 3 Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Step 1 */}
            <div
              className="flex flex-col items-center"
            >
              <div className="bg-gray-800 p-6 rounded-full mb-6 border border-gray-700">
                <UserPlus className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Create Your Account</h3>
              <p className="text-gray-400">Sign up in seconds. All you need is an email and password to start your journey.</p>
            </div>
            {/* Step 2 */}
            <div
              className="flex flex-col items-center"
            >
              <div className="bg-gray-800 p-6 rounded-full mb-6 border border-gray-700">
                <Share2 className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Share Your Unique Link</h3>
              <p className="text-gray-400">We generate a special link just for you. Share it on social media, with friends, or with colleagues.</p>
            </div>
            {/* Step 3 */}
            <div
              className="flex flex-col items-center"
            >
              <div className="bg-gray-800 p-6 rounded-full mb-6 border border-gray-700">
                <MessageSquareQuote className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Receive Honest Feedback</h3>
              <p className="text-gray-400">Messages arrive in your private dashboard. Completely anonymous, completely honest.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-32">
            <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Feature 1: True Anonymity */}
                <FeatureCard
                    icon={<Lock className="w-8 h-8 text-white" />}
                    title="True Anonymity, Guaranteed"
                    description="We don't track IPs or any personal data of the sender. Your identity is a secret, and so is theirs. This encourages unfiltered and genuine feedback."
                />
                {/* Feature 2: Secure & Private */}
                 <FeatureCard
                    icon={<Share2 className="w-8 h-8 text-white" />}
                    title="Seamless & Simple"
                    description="No complicated setups. Get your link, share it, and watch the feedback roll in. Our user-friendly dashboard makes viewing your messages a breeze."
                />
            </div>
        </section>

        {/* Our Mission Section  */}
         <section className="text-center max-w-4xl mx-auto">
           <div>
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
                In a world full of noise, clear and honest communication is rare. We believe that constructive feedback is a gift for personal and professional growth. Our mission is to provide the tools to share these insights safely, fostering a culture of empathy and understanding, one anonymous message at a time.
            </p>
           </div>
        </section>
      </main>
    </div>
  );
}

// A reusable FeatureCard component for the "Why Choose Us" section
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
    return (
        <div
            className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/60 backdrop-blur-sm transition-all hover:border-indigo-500/80 hover:bg-gray-800/80 group"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-600 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold">{title}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    )
}




"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { Mail, Quote } from "lucide-react";

// Mock data to replace the "@/message.json" import
const messages = [
  {
    "title": "A True Friend",
    "content": "Your advice has always been a guiding light. Thank you for everything!",
    "received": "1 day ago"
  },
  {
    "title": "Constructive Feedback",
    "content": "The project was great, but we could improve the presentation flow for next time.",
    "received": "3 days ago"
  },
  {
    "title": "Secret Admirer",
    "content": "Just wanted to say you have a great sense of style!",
    "received": "1 week ago"
  },
  {
    "title": "Team Player",
    "content": "Really appreciate you staying late to help with the deadline. You're a lifesaver!",
    "received": "2 weeks ago"
  }
];


const Home = () => {
  return (
    <>
      <main className="relative flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-20 bg-slate-900 text-white overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <section className="text-center mb-12 md:mb-16 z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Uncover Honest Thoughts
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            A safe space for anonymous feedback. Share your link and see what people really think, without revealing their identity.
          </p>
        </section>

        {/* Carousel with redesigned cards */}
        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl z-10"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2 sm:p-4">
                <Card className="bg-white/10 border-white/20 text-white backdrop-blur-lg shadow-lg rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Quote className="w-8 h-8 text-purple-400" />
                      <h3 className="text-xl font-semibold">{message.title}</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm sm:text-base mb-4">{message.content}</p>
                    <p className="text-xs text-slate-400 italic text-right">{message.received}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex text-white bg-white/20 hover:bg-white/30 border-none" />
          <CarouselNext className="hidden sm:inline-flex text-white bg-white/20 hover:bg-white/30 border-none" />
        </Carousel>

        {/* Call to action */}
        <section className="mt-16 text-center z-10">
          <a href="/sign-up">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity duration-300 transform hover:scale-105">
              Start Receiving Feedback
            </Button>
          </a>
        </section>
      </main>

  
    </>
  );
};

export default Home;

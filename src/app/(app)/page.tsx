'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import Footer from '@/components/Footer' ;

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
    <Navbar/>
      {/* Main content */}
      <div className="flex flex-col min-h-[89vh]">
  <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-100 text-black">
    <section className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl md:text-5xl font-bold">
          Keep your Friends guessing about your Identity🤔      
      </h1>
      <p className="mt-3 md:mt-4 md:text-lg font-semibold text-3xl">
          Message them Anonymously & Expressss your True Feelings🤭🤭🤭 
      </p>
    </section>

    {/* Carousel for Messages */}
    <Carousel
      plugins={[Autoplay({ delay: 2000 })]}
      className="w-full max-w-lg md:max-w-xl"
    >
      <CarouselContent>
        {messages.map((message, index) => (
          <CarouselItem key={index} className="p-4">
            <Card className='bg-blue-500 rounded-xl border-4 border-blue-700'>
              <CardHeader>
                <CardTitle>{message.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                <Mail className="flex-shrink-0" />
                <div>
                  <p>{message.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {message.received}
                  </p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  </main>

  {/* Footer */}
  <Footer />
</div>


    </>
  );
}
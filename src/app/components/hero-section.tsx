"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { GlassButton } from "@/components/glass/glass-button";
import { cn } from "@/lib/utils";

/**
 * Full-screen hero with an auto-rotating background carousel.
 *
 * Replace the image paths below with your actual factory / stretch-film
 * photography.
 */
const slides = [
  {
    src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/home/hero1.webp",
    alt: "M2K Packpro stretch film manufacturing facility",
  },
  {
    src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/home/hero2.webp",
    alt: "Machine grade stretch film rolls",
  },
  {
    src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/home/hero3.webp",
    alt: "Stretch film production at M2K Packpro Industries",
  },
  {
    src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/home/hero4.webp",
    alt: "",
  },
];

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[calc(100svh-0.1rem)] overflow-hidden sm:min-h-[calc(100svh-0.2rem)]">
      {/* Background carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === activeSlide ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Stronger contrast behind the copy */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />

      {/* Bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/80 to-transparent" />

      {/* Subtle brand warmth */}
      <div
        aria-hidden
        className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
      />

      {/* Hero content */}
      <div className="relative z-10 flex min-h-[calc(100svh-4rem)] items-center sm:min-h-[calc(100svh-5rem)]">
        <div className="w-full px-5 py-20 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <p className="text-brand-amber font-mono text-xs sm:text-base 2xl:text-lg font-medium tracking-[0.28em] uppercase">
              Manufacturing Excellence
            </p>

            {/* Brand */}
            <h1 className="mt-5 max-w-5xl text-4xl sm:text-4xl lg:text-5xl xl:text-6xl 3xl:text-7xl leading-[0.98] font-extrabold tracking-[0.04em] text-white ">
              <span className="text-brand-lit">M2K </span>PACKPRO
              <br />
              INDUSTRIES
            </h1>

            {/* Tagline */}
            <p className="mt-6 max-w-3xl text-lg sm:text-xl lg:text-2xl leading-relaxed font-mono font-medium text-white/80 ">
              Stretch films made to hold forever.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <GlassButton asChild variant="solid" size="lg">
                <Link href="/contact">Request Quote</Link>
              </GlassButton>

              <GlassButton
                asChild
                variant="glass"
                size="lg"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/products">Product Range</Link>
              </GlassButton>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel navigation */}
      <div className="absolute right-5 bottom-8 z-20 flex items-center gap-2 sm:right-8 lg:right-12">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveSlide(index)}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === activeSlide}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              index === activeSlide
                ? "w-10 bg-white"
                : "w-5 bg-white/35 hover:bg-white/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { HomeContent } from '@/lib/types';

interface HeroVideoProps {
  hero: HomeContent['hero'];
}

export default function HeroVideo({ hero }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer to pause video when not visible
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            setIsPlaying(false);
          } else if (entry.isIntersecting && !prefersReducedMotion && video.paused && isPlaying) {
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion, isPlaying]);

  // Auto-play on load if reduced motion is not preferred
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion || videoError) return;

    video.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay was prevented, user needs to interact
        setIsPlaying(false);
      });
  }, [prefersReducedMotion, videoError]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setVideoError(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
    setIsPlaying(false);
  };

  const getVariant = (variant: string): 'primary' | 'secondary' | 'ghost' => {
    if (variant === 'primary') return 'primary';
    if (variant === 'secondary') return 'secondary';
    return 'ghost';
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden"
      aria-label="Hero section with video background"
    >
      {/* Video Background */}
      {!videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          poster={hero.posterSrc}
          onError={handleVideoError}
          aria-hidden="true"
        >
          <source src={hero.videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Fallback poster image if video fails */}
      {videoError && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.posterSrc})` }}
          aria-hidden="true"
        />
      )}

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl">
          {hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
          {hero.subheadline}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {hero.ctas.map((cta) => (
            <Button
              key={cta.href}
              href={cta.href}
              variant={getVariant(cta.variant)}
              size="lg"
              className={cta.variant === 'ghost' ? 'border-white text-white hover:bg-white/10' : ''}
            >
              {cta.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Play/Pause Button */}
      {!videoError && (
        <button
          type="button"
          onClick={togglePlayPause}
          className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      )}
    </section>
  );
}

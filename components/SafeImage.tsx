'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Disc3, Music2 } from 'lucide-react';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/album-midnight-drive.jpg',
  alt,
  className = '',
  fill,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  useEffect(() => {
    setError(false);
    setFallbackError(false);
  }, [src]);

  // If both failed or neither available, render a sleek styled gradient avatar
  if ((error && fallbackError) || (!src && !fallbackSrc)) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-950 flex items-center justify-center text-amber-400 ${className}`}
      >
        <Music2 className="w-8 h-8 opacity-70 animate-pulse" />
      </div>
    );
  }

  const resolvedSrc = !src || error ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt || 'Album Art'}
      fill={fill}
      className={className}
      onError={() => {
        if (!error && src) {
          setError(true);
        } else {
          setFallbackError(true);
        }
      }}
      unoptimized={resolvedSrc.startsWith('http')}
    />
  );
};


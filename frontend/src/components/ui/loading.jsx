import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loading = ({ 
  size = 'default', 
  variant = 'spinner', 
  text = 'Loading...',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizeClasses[size]} bg-primary rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        {text && (
          <span className={`ml-2 text-muted-foreground ${textSizes[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-primary rounded-full`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {text && (
          <span className={`text-muted-foreground ${textSizes[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} animate-spin text-primary`} 
      />
      {text && (
        <span className={`text-muted-foreground ${textSizes[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Full page loading component
export const FullPageLoading = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loading size="xl" text="" />
        <p className="text-lg text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

// Skeleton loading component
export const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-muted rounded ${className}`}
      {...props}
    />
  );
};

export default Loading; 
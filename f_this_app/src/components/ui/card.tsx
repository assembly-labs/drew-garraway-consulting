'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  selected?: boolean;
}

export function Card({
  children,
  className,
  onClick,
  hoverable = false,
  selected = false,
}: CardProps) {
  const Component = onClick || hoverable ? motion.div : 'div';
  const motionProps = onClick || hoverable ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  } : {};

  return (
    <Component
      onClick={onClick}
      {...motionProps}
      className={cn(
        'p-4 rounded-2xl',
        'bg-gradient-to-b from-gray-800/80 to-gray-900/80',
        'border border-gray-700/50',
        'backdrop-blur-sm',
        onClick && 'cursor-pointer',
        selected && 'ring-2 ring-red-500 border-red-500',
        className
      )}
    >
      {children}
    </Component>
  );
}

// Preset card for game mode selection
interface PresetCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function PresetCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: PresetCardProps) {
  return (
    <Card
      onClick={onClick}
      hoverable
      selected={selected}
      className="flex items-start gap-4"
    >
      {icon && (
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
          selected ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'
        )}>
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </Card>
  );
}

// Stat card for displaying numbers
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'same';
  trendValue?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, trend, trendValue, icon }: StatCardProps) {
  return (
    <Card className="text-center">
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center mx-auto mb-2 text-gray-400">
          {icon}
        </div>
      )}
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
      {trend && trendValue && (
        <div className={cn(
          'text-xs mt-2',
          trend === 'up' && 'text-red-400',
          trend === 'down' && 'text-green-400',
          trend === 'same' && 'text-gray-500'
        )}>
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trend === 'same' && '–'}
          {' '}{trendValue}
        </div>
      )}
    </Card>
  );
}

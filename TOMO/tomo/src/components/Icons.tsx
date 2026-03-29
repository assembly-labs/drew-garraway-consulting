/**
 * TOMO — React Native Icon Library
 *
 * Converted from the web prototype's SVG icons (prototype/src/components/ui/Icons.tsx)
 * to react-native-svg components. These are the ~25 icons needed for MVP screens.
 *
 * SETUP: npm install react-native-svg
 *
 * USAGE:
 *   import { Icons } from '@/components/Icons';
 *   <Icons.Mic size={24} color={colors.gold} />
 *
 * Source: Lucide, Feather, Heroicons (all MIT licensed)
 * Full web library has 75+ icons — add more as needed from the prototype.
 */

import React from 'react';
import Svg, { Path, Line, Circle, Polyline, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// ============================================
// NAVIGATION (Tab bar, headers)
// ============================================

function Journal({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <Line x1="8" y1="6" x2="16" y2="6" />
      <Line x1="8" y1="10" x2="14" y2="10" />
    </Svg>
  );
}

function Profile({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="8" r="4" />
      <Path d="M20 21a8 8 0 1 0-16 0" />
    </Svg>
  );
}

function Back({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="19" y1="12" x2="5" y2="12" />
      <Polyline points="12 19 5 12 12 5" />
    </Svg>
  );
}

function Close({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

// ============================================
// CHEVRONS
// ============================================

function ChevronRight({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}

function ChevronDown({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="6 9 12 15 18 9" />
    </Svg>
  );
}

function ChevronUp({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="18 15 12 9 6 15" />
    </Svg>
  );
}

// ============================================
// SESSION LOGGING
// ============================================

function Mic({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <Line x1="12" y1="19" x2="12" y2="23" />
      <Line x1="8" y1="23" x2="16" y2="23" />
    </Svg>
  );
}

function Stop({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </Svg>
  );
}

function Keyboard({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <Line x1="6" y1="8" x2="6" y2="8" />
      <Line x1="10" y1="8" x2="10" y2="8" />
      <Line x1="14" y1="8" x2="14" y2="8" />
      <Line x1="18" y1="8" x2="18" y2="8" />
      <Line x1="6" y1="12" x2="6" y2="12" />
      <Line x1="10" y1="12" x2="10" y2="12" />
      <Line x1="14" y1="12" x2="14" y2="12" />
      <Line x1="18" y1="12" x2="18" y2="12" />
      <Line x1="8" y1="16" x2="16" y2="16" />
    </Svg>
  );
}

// ============================================
// STATUS & FEEDBACK
// ============================================

function Check({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

function CheckCircle({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

function AlertCircle({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
    </Svg>
  );
}

function Info({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  // Lucide "info" — circle with "i", for informational (non-error) messages
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 16v-4" />
      <Path d="M12 8h.01" />
    </Svg>
  );
}

function WifiOff({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  // Lucide "wifi-off" — for network/connectivity errors
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 20h.01" />
      <Path d="M8.5 16.429a5 5 0 0 1 7 0" />
      <Path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
      <Path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
      <Path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
      <Path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
      <Path d="m2 2 20 20" />
    </Svg>
  );
}

// ============================================
// ACTIONS
// ============================================

function Plus({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

function Minus({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

function Edit({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  // Lucide "pen-line" — pencil only, no square. Reads clean at 10-14px.
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M13 21h8" />
      <Path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    </Svg>
  );
}

function Trash({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="3 6 5 6 21 6" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );
}

function Filter({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </Svg>
  );
}

function Logout({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Polyline points="16 17 21 12 16 7" />
      <Line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  );
}

// ============================================
// BJJ-SPECIFIC
// ============================================

function Sparring({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  // Lucide "swords" — crossed swords, reads as combat/sparring not "group"
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <Line x1="13" y1="19" x2="19" y2="13" />
      <Line x1="16" y1="16" x2="20" y2="20" />
      <Line x1="19" y1="21" x2="21" y2="19" />
      <Polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <Line x1="5" y1="14" x2="9" y2="18" />
      <Line x1="7" y1="17" x2="4" y2="20" />
      <Line x1="3" y1="19" x2="5" y2="21" />
    </Svg>
  );
}

function Shield({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

// ============================================
// LOCATION
// ============================================

function MapPin({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <Circle cx="12" cy="9" r="2.5" />
    </Svg>
  );
}

// ============================================
// EXPORT
// ============================================

function Camera({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <Circle cx="12" cy="13" r="4" />
    </Svg>
  );
}

// ============================================
// AUTH
// ============================================

function Eye({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

function EyeOff({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <Path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <Line x1="1" y1="1" x2="23" y2="23" />
    </Svg>
  );
}

export const Icons = {
  // Navigation
  Journal,
  Profile,
  Back,
  Close,
  // Chevrons
  ChevronRight,
  ChevronDown,
  ChevronUp,
  // Session logging
  Mic,
  Stop,
  Keyboard,
  // Status
  Check,
  CheckCircle,
  AlertCircle,
  Info,
  WifiOff,
  // Actions
  Plus,
  Minus,
  Edit,
  Trash,
  Filter,
  Logout,
  // BJJ
  Sparring,
  // Location
  MapPin,
  // Auth
  Eye,
  EyeOff,
  // Misc
  Shield,
  Camera,
} as const;

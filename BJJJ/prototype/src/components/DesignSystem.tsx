/**
 * Design System Showcase - BOLD DARK THEME
 * Linear/Palantir inspired aesthetic
 *
 * RULES:
 * - NO EMOJIS - lineart SVG only
 * - Dark backgrounds (#0a0a0a)
 * - Large typography
 * - Full-bleed sections
 * - Semantic colors: GREEN = positive, RED = negative
 */

import { useState } from 'react';
import { BeltBadge, TrainingBadge } from './ui';
import { IconCheck, IconFlame, IconTrophy, IconTarget, IconTrendUp, IconTrendDown } from './ui/Icons';
import type { BeltColor } from '../data/users';
import type { TrainingType } from '../data/journal';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      marginBottom: '64px',
      paddingTop: '48px',
      borderTop: '1px solid var(--color-gray-800)',
    }}>
      <h2 style={{
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: 'var(--color-gold)',
        marginBottom: '32px',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '48px' }}>
      <h3 style={{
        fontSize: '11px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--color-gray-400)',
        marginBottom: '24px',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ColorSwatch({ name, color, textColor = '#fff' }: { name: string; color: string; textColor?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 80,
        height: 80,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '8px',
        color: textColor,
        fontSize: '9px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
      }}>
        {color.startsWith('#') ? color : ''}
      </div>
      <span style={{
        fontSize: '10px',
        color: 'var(--color-gray-400)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginTop: '8px',
        display: 'block',
      }}>
        {name}
      </span>
    </div>
  );
}

export function DesignSystem() {
  const [activeTab, setActiveTab] = useState<'foundations' | 'components' | 'patterns'>('foundations');

  return (
    <div style={{
      background: 'var(--color-black)',
      minHeight: '100vh',
      color: 'var(--color-white)',
    }}>
      {/* Hero Header */}
      <div style={{
        padding: '80px 24px 48px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'var(--color-gold)',
          marginBottom: '16px',
        }}>
          Design System v2.0
        </div>
        <h1 style={{
          fontSize: 'clamp(48px, 10vw, 80px)',
          fontWeight: 700,
          lineHeight: 0.9,
          letterSpacing: '-0.03em',
          marginBottom: '24px',
        }}>
          ALLY
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--color-gray-400)',
          maxWidth: '400px',
          lineHeight: 1.6,
        }}>
          Bold, dark, typography-forward design system. No emojis. Large numbers. Full-bleed sections.
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-gray-800)',
        zIndex: 100,
      }}>
        <div style={{
          display: 'flex',
          gap: '0',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
        }}>
          {(['foundations', 'components', 'patterns'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '20px 24px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: activeTab === tab ? 'var(--color-gold)' : 'var(--color-gray-500)',
                borderBottom: activeTab === tab ? '2px solid var(--color-gold)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>

        {/* FOUNDATIONS TAB */}
        {activeTab === 'foundations' && (
          <>
            {/* Colors */}
            <Section title="Colors">
              <Subsection title="Core Palette">
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  <ColorSwatch name="Black" color="#0a0a0a" />
                  <ColorSwatch name="Gray 900" color="#0f0f0f" />
                  <ColorSwatch name="Gray 800" color="#1a1a1a" />
                  <ColorSwatch name="Gray 700" color="#404040" />
                  <ColorSwatch name="Gray 400" color="#a3a3a3" textColor="#000" />
                  <ColorSwatch name="White" color="#ffffff" textColor="#000" />
                  <ColorSwatch name="Gold" color="#F5A623" textColor="#000" />
                </div>
              </Subsection>

              <Subsection title="Semantic Colors">
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  <ColorSwatch name="Positive" color="#22c55e" />
                  <ColorSwatch name="Negative" color="#ef4444" />
                  <ColorSwatch name="Warning" color="#f59e0b" />
                  <ColorSwatch name="Info" color="#3b82f6" />
                </div>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-gray-400)',
                  marginTop: '24px',
                  maxWidth: '500px',
                  lineHeight: 1.6,
                }}>
                  <strong style={{ color: 'var(--color-positive)' }}>Green</strong> = positive outcomes (submissions landed, wins, progress).
                  <br />
                  <strong style={{ color: 'var(--color-negative)' }}>Red</strong> = negative outcomes (times tapped, losses, weaknesses).
                </p>
              </Subsection>

              <Subsection title="Belt Colors">
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  <ColorSwatch name="White" color="#FFFFFF" textColor="#000" />
                  <ColorSwatch name="Blue" color="#0033A0" />
                  <ColorSwatch name="Purple" color="#4B0082" />
                  <ColorSwatch name="Brown" color="#8B4513" />
                  <ColorSwatch name="Black" color="#000000" />
                </div>
              </Subsection>
            </Section>

            {/* Typography */}
            <Section title="Typography">
              <Subsection title="Hero Numbers">
                <div style={{
                  fontSize: 'clamp(80px, 20vw, 144px)',
                  fontWeight: 700,
                  lineHeight: 0.85,
                  letterSpacing: '-0.04em',
                  background: 'linear-gradient(180deg, #ffffff 0%, #666666 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  127
                </div>
                <div style={{
                  fontSize: '22px',
                  fontWeight: 300,
                  color: 'var(--color-gray-400)',
                  marginTop: '-8px',
                }}>
                  sessions logged
                </div>
              </Subsection>

              <Subsection title="Section Titles">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--color-white)',
                    }}>
                      Section Title
                    </div>
                    <code style={{ fontSize: '10px', color: 'var(--color-gray-500)' }}>
                      12px / 600 / uppercase / 0.15em tracking
                    </code>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'var(--color-gold)',
                    }}>
                      Eyebrow Label
                    </div>
                    <code style={{ fontSize: '10px', color: 'var(--color-gray-500)' }}>
                      Space Mono / 10px / uppercase / 0.2em tracking / gold
                    </code>
                  </div>
                </div>
              </Subsection>

              <Subsection title="Body Text">
                <div style={{
                  fontSize: '16px',
                  color: 'var(--color-gray-100)',
                  lineHeight: 1.6,
                  maxWidth: '500px',
                }}>
                  Body text uses Space Grotesk at 16px with 1.6 line height. Keep paragraphs concise for exhausted users post-training.
                </div>
              </Subsection>
            </Section>

            {/* Spacing */}
            <Section title="Spacing">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'xs', value: '4px' },
                  { name: 'sm', value: '8px' },
                  { name: 'md', value: '16px' },
                  { name: 'lg', value: '24px' },
                  { name: 'xl', value: '32px' },
                  { name: '2xl', value: '48px' },
                  { name: '3xl', value: '64px' },
                ].map((space) => (
                  <div key={space.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: space.value,
                      height: '24px',
                      backgroundColor: 'var(--color-gold)',
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-gray-400)',
                      minWidth: '40px',
                    }}>
                      {space.name}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-gray-600)',
                    }}>
                      {space.value}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* COMPONENTS TAB */}
        {activeTab === 'components' && (
          <>
            {/* Stat Displays */}
            <Section title="Stat Displays">
              <Subsection title="Large Metric Grid">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px',
                  background: 'var(--color-gray-800)',
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, var(--color-black) 100%)',
                    padding: '40px 24px',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'var(--color-positive)',
                      marginBottom: '12px',
                    }}>
                      Submissions
                    </div>
                    <div style={{
                      fontSize: '64px',
                      fontWeight: 700,
                      color: 'var(--color-positive)',
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}>
                      18
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-400)', marginTop: '8px' }}>
                      you landed
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, var(--color-black) 100%)',
                    padding: '40px 24px',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'var(--color-negative)',
                      marginBottom: '12px',
                    }}>
                      Tapped Out
                    </div>
                    <div style={{
                      fontSize: '64px',
                      fontWeight: 700,
                      color: 'var(--color-negative)',
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}>
                      24
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-400)', marginTop: '8px' }}>
                      this month
                    </div>
                  </div>
                </div>
              </Subsection>

              <Subsection title="Arsenal Grid (5-col)">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '2px',
                  background: 'var(--color-gray-800)',
                }}>
                  {[
                    { label: 'Subs', value: 12 },
                    { label: 'Sweeps', value: 8 },
                    { label: 'Passes', value: 15 },
                    { label: 'Escapes', value: 6 },
                    { label: 'TDs', value: 4 },
                  ].map((item) => (
                    <div key={item.label} style={{
                      background: 'var(--color-gray-900)',
                      padding: '20px 12px',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: 'var(--color-white)',
                        lineHeight: 1,
                      }}>
                        {item.value}
                      </div>
                      <div style={{
                        fontSize: '9px',
                        color: 'var(--color-gray-400)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '8px',
                      }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Subsection>

              <Subsection title="Progress Categories (4-col)">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '2px',
                  background: 'var(--color-gray-800)',
                }}>
                  {[
                    { label: 'Guard', value: 85, status: 'positive' },
                    { label: 'Pass', value: 72, status: 'positive' },
                    { label: 'Mount', value: 45, status: 'neutral' },
                    { label: 'Back', value: 28, status: 'negative' },
                  ].map((item) => (
                    <div key={item.label} style={{
                      background: item.status === 'positive'
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, var(--color-gray-900) 100%)'
                        : item.status === 'negative'
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, var(--color-gray-900) 100%)'
                        : 'var(--color-gray-900)',
                      padding: '20px 12px',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: item.status === 'positive'
                          ? 'var(--color-positive)'
                          : item.status === 'negative'
                          ? 'var(--color-negative)'
                          : 'var(--color-white)',
                        lineHeight: 1,
                      }}>
                        {item.value}%
                      </div>
                      <div style={{
                        fontSize: '9px',
                        color: 'var(--color-gray-400)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '8px',
                      }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Subsection>
            </Section>

            {/* Buttons */}
            <Section title="Buttons">
              <Subsection title="Primary Actions">
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button style={{
                    padding: '16px 32px',
                    background: 'var(--color-gold)',
                    border: 'none',
                    color: 'var(--color-black)',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}>
                    Log Training
                  </button>
                  <button style={{
                    padding: '16px 32px',
                    background: 'var(--color-gray-900)',
                    border: '1px solid var(--color-gray-800)',
                    color: 'var(--color-white)',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}>
                    View Details
                  </button>
                  <button style={{
                    padding: '16px 32px',
                    background: 'transparent',
                    border: '1px solid var(--color-gray-700)',
                    color: 'var(--color-white)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}>
                    Outline
                  </button>
                </div>
              </Subsection>

              <Subsection title="Semantic Buttons">
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button style={{
                    padding: '12px 24px',
                    background: 'var(--color-positive)',
                    border: 'none',
                    color: 'var(--color-black)',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}>
                    Confirm
                  </button>
                  <button style={{
                    padding: '12px 24px',
                    background: 'var(--color-negative)',
                    border: 'none',
                    color: 'var(--color-white)',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}>
                    Delete
                  </button>
                </div>
              </Subsection>
            </Section>

            {/* Badges */}
            <Section title="Badges">
              <Subsection title="Belt Badges">
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {(['white', 'blue', 'purple', 'brown', 'black'] as BeltColor[]).map((belt) => (
                    <div key={belt} style={{ textAlign: 'center' }}>
                      <BeltBadge belt={belt} stripes={2} size="lg" />
                      <p style={{
                        fontSize: '10px',
                        color: 'var(--color-gray-400)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '8px',
                      }}>
                        {belt}
                      </p>
                    </div>
                  ))}
                </div>
              </Subsection>

              <Subsection title="Training Types">
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {(['gi', 'nogi', 'openmat', 'private', 'competition'] as TrainingType[]).map((type) => (
                    <TrainingBadge key={type} type={type} />
                  ))}
                </div>
              </Subsection>
            </Section>

            {/* Icons */}
            <Section title="Lineart Icons">
              <p style={{
                fontSize: '13px',
                color: 'var(--color-gray-400)',
                marginBottom: '24px',
                maxWidth: '400px',
              }}>
                Never use emojis. Always use SVG lineart icons from the Icons component.
              </p>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { Icon: IconCheck, name: 'Check' },
                  { Icon: IconFlame, name: 'Flame' },
                  { Icon: IconTrophy, name: 'Trophy' },
                  { Icon: IconTarget, name: 'Target' },
                  { Icon: IconTrendUp, name: 'TrendUp' },
                  { Icon: IconTrendDown, name: 'TrendDown' },
                ].map(({ Icon, name }) => (
                  <div key={name} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      background: 'var(--color-gray-900)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-gold)',
                    }}>
                      <Icon size={24} />
                    </div>
                    <span style={{
                      fontSize: '9px',
                      color: 'var(--color-gray-500)',
                      marginTop: '8px',
                      display: 'block',
                    }}>
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* PATTERNS TAB */}
        {activeTab === 'patterns' && (
          <>
            {/* Callouts */}
            <Section title="Callouts">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{
                  padding: '32px 24px',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, transparent 100%)',
                  borderLeft: '3px solid var(--color-positive)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    color: 'var(--color-positive)',
                    marginBottom: '12px',
                  }}>
                    What's Working
                  </div>
                  <p style={{ fontSize: '16px', color: 'var(--color-gray-100)', lineHeight: 1.6, margin: 0 }}>
                    Your guard game is developing. Sweep attempts up 40%. That's your game emerging.
                  </p>
                </div>
                <div style={{
                  padding: '32px 24px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, transparent 100%)',
                  borderLeft: '3px solid var(--color-negative)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    color: 'var(--color-negative)',
                    marginBottom: '12px',
                  }}>
                    Needs Work
                  </div>
                  <p style={{ fontSize: '16px', color: 'var(--color-gray-100)', lineHeight: 1.6, margin: 0 }}>
                    Mount escapes have dropped off. Zero drills in 3 weeks. Focus here.
                  </p>
                </div>
              </div>
            </Section>

            {/* Bar Charts */}
            <Section title="Horizontal Bars">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                {[
                  { name: 'Armbar', count: 16, width: '100%', variant: 'gold' },
                  { name: 'Triangle', count: 10, width: '62%', variant: 'gray' },
                  { name: 'RNC', count: 6, width: '37%', variant: 'gray' },
                  { name: 'Kimura', count: 4, width: '25%', variant: 'gray' },
                ].map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-gray-600)',
                      width: '20px',
                    }}>
                      {i + 1}
                    </span>
                    <div style={{
                      flex: 1,
                      height: '32px',
                      background: 'var(--color-gray-900)',
                      position: 'relative',
                    }}>
                      <div style={{
                        width: item.width,
                        height: '100%',
                        background: item.variant === 'gold' ? 'var(--color-gold)' : 'var(--color-gray-600)',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '12px',
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: item.variant === 'gold' ? 'var(--color-black)' : 'var(--color-white)',
                        }}>
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--color-white)',
                      minWidth: '32px',
                      textAlign: 'right',
                    }}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* List Items */}
            <Section title="List Items">
              <div style={{ maxWidth: '400px' }}>
                {[
                  { title: 'Today', meta: '90min / 3 tech / 5 rolls', type: 'gi' },
                  { title: 'Yesterday', meta: '60min / 2 tech / 3 rolls', type: 'nogi' },
                  { title: 'Dec 18', meta: '120min / Open mat', type: 'openmat' },
                ].map((item, i, arr) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--color-gray-800)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-white)' }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--color-gray-400)',
                        marginTop: '4px',
                      }}>
                        {item.meta}
                      </div>
                    </div>
                    <TrainingBadge type={item.type as TrainingType} size="sm" />
                  </div>
                ))}
              </div>
            </Section>

            {/* Streak Display */}
            <Section title="Streak Display">
              <div style={{
                padding: '64px 24px',
                textAlign: 'center',
                position: 'relative',
                background: 'var(--color-gray-900)',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, var(--color-positive-glow) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  fontSize: 'clamp(100px, 30vw, 160px)',
                  fontWeight: 700,
                  lineHeight: 0.8,
                  letterSpacing: '-0.05em',
                  color: 'var(--color-positive)',
                  position: 'relative',
                }}>
                  14
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: 'var(--color-positive)',
                  marginTop: '16px',
                }}>
                  Day Streak
                </div>
              </div>
            </Section>

            {/* Forms */}
            <Section title="Form Elements">
              <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--color-gray-400)',
                    marginBottom: '8px',
                  }}>
                    Session Notes
                  </label>
                  <textarea
                    placeholder="What did you work on today?"
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'var(--color-gray-900)',
                      border: '1px solid var(--color-gray-800)',
                      color: 'var(--color-white)',
                      fontSize: '15px',
                      fontFamily: 'var(--font-body)',
                      minHeight: '120px',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--color-gray-400)',
                    marginBottom: '8px',
                  }}>
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="60"
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'var(--color-gray-900)',
                      border: '1px solid var(--color-gray-800)',
                      color: 'var(--color-white)',
                      fontSize: '15px',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

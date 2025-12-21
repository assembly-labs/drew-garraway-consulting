/**
 * Design System Showcase
 * Living documentation of all UI elements, components, and patterns
 * Use this as a reference when building features
 */

import { useState } from 'react';
import { BeltBadge, StatCard, TrainingBadge, ProgressRing } from './ui';
import type { BeltColor } from '../data/users';
import type { TrainingType } from '../data/journal';

// Section wrapper component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--space-2xl)' }}>
      <h2 style={{
        borderBottom: '2px solid var(--color-accent)',
        paddingBottom: 'var(--space-sm)',
        marginBottom: 'var(--space-lg)',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

// Subsection wrapper
function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--space-xl)' }}>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-gray-700)' }}>{title}</h3>
      {children}
    </div>
  );
}

// Color swatch component
function ColorSwatch({ name, color, textColor = '#000' }: { name: string; color: string; textColor?: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-xs)',
    }}>
      <div style={{
        width: 80,
        height: 80,
        backgroundColor: color,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-gray-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: textColor,
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
      }}>
        {color.startsWith('var') ? '' : color}
      </div>
      <span className="text-small text-muted">{name}</span>
    </div>
  );
}

export function DesignSystem() {
  const [activeTab, setActiveTab] = useState<'foundations' | 'components' | 'patterns'>('foundations');

  return (
    <div style={{ padding: 'var(--space-lg)', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>BJJ JOURNAL DESIGN SYSTEM</h1>
        <p className="text-muted">Living documentation of UI elements, components, and patterns</p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xl)',
        borderBottom: '1px solid var(--color-gray-200)',
        paddingBottom: 'var(--space-sm)',
      }}>
        {(['foundations', 'components', 'patterns'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--space-sm) var(--space-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              color: activeTab === tab ? 'var(--color-accent-text)' : 'var(--color-gray-500)',
              borderBottom: activeTab === tab ? '2px solid var(--color-accent)' : '2px solid transparent',
              marginBottom: -9,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FOUNDATIONS TAB */}
      {activeTab === 'foundations' && (
        <>
          {/* Colors */}
          <Section title="Colors">
            <Subsection title="Primary Brand">
              <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <ColorSwatch name="Primary" color="#000000" textColor="#fff" />
                <ColorSwatch name="Primary Light" color="#1a1a1a" textColor="#fff" />
                <ColorSwatch name="Accent" color="#FCD34D" />
                <ColorSwatch name="Accent Hover" color="#FBBF24" />
                <ColorSwatch name="Accent Dark" color="#F59E0B" />
              </div>
            </Subsection>

            <Subsection title="Belt Colors">
              <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <ColorSwatch name="White" color="#FFFFFF" />
                <ColorSwatch name="Blue" color="#0033A0" textColor="#fff" />
                <ColorSwatch name="Purple" color="#4B0082" textColor="#fff" />
                <ColorSwatch name="Brown" color="#8B4513" textColor="#fff" />
                <ColorSwatch name="Black" color="#000000" textColor="#fff" />
              </div>
            </Subsection>

            <Subsection title="Training Types">
              <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <ColorSwatch name="Gi" color="#3B82F6" textColor="#fff" />
                <ColorSwatch name="No-Gi" color="#F97316" textColor="#fff" />
                <ColorSwatch name="Open Mat" color="#A855F7" textColor="#fff" />
                <ColorSwatch name="Private" color="#22C55E" textColor="#fff" />
                <ColorSwatch name="Competition" color="#EF4444" textColor="#fff" />
              </div>
            </Subsection>

            <Subsection title="Status Colors">
              <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <ColorSwatch name="Success" color="#22C55E" textColor="#fff" />
                <ColorSwatch name="Warning" color="#F59E0B" textColor="#fff" />
                <ColorSwatch name="Error" color="#EF4444" textColor="#fff" />
                <ColorSwatch name="Info" color="#3B82F6" textColor="#fff" />
              </div>
            </Subsection>

            <Subsection title="Grayscale">
              <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <ColorSwatch name="Gray 50" color="#FAFAFA" />
                <ColorSwatch name="Gray 100" color="#F5F5F5" />
                <ColorSwatch name="Gray 200" color="#E5E5E5" />
                <ColorSwatch name="Gray 300" color="#D4D4D4" />
                <ColorSwatch name="Gray 400" color="#A3A3A3" />
                <ColorSwatch name="Gray 500" color="#6B7280" textColor="#fff" />
                <ColorSwatch name="Gray 700" color="#374151" textColor="#fff" />
                <ColorSwatch name="Gray 900" color="#171717" textColor="#fff" />
              </div>
            </Subsection>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <Subsection title="Headings (Montserrat)">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h1>H1 - BJJ JOURNAL HEADING</h1>
                <h2>H2 - SECTION TITLE</h2>
                <h3>H3 - SUBSECTION</h3>
                <h4>H4 - CARD TITLE</h4>
                <h5>H5 - SMALL HEADING</h5>
                <h6>H6 - LABEL</h6>
              </div>
            </Subsection>

            <Subsection title="Body Text (Open Sans)">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <p style={{ fontSize: 'var(--text-lg)' }}>Large text - 1.125rem / 18px</p>
                <p style={{ fontSize: 'var(--text-base)' }}>Base text - 1rem / 16px - Default body copy for paragraphs and content.</p>
                <p style={{ fontSize: 'var(--text-sm)' }}>Small text - 0.875rem / 14px - Secondary information and captions.</p>
                <p style={{ fontSize: 'var(--text-xs)' }}>Extra small - 0.75rem / 12px - Labels, badges, timestamps.</p>
              </div>
            </Subsection>

            <Subsection title="Text Styles">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <p className="font-bold">Bold text - font-weight: 700</p>
                <p className="text-muted">Muted text - color: gray-500</p>
                <p className="text-uppercase" style={{ letterSpacing: 'var(--tracking-wider)' }}>UPPERCASE WITH TRACKING</p>
                <p><a href="#">Link style - underlined with accent color</a></p>
              </div>
            </Subsection>
          </Section>

          {/* Spacing */}
          <Section title="Spacing Scale">
            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[
                  { name: 'XS', value: '4px', var: '--space-xs' },
                  { name: 'SM', value: '8px', var: '--space-sm' },
                  { name: 'MD', value: '16px', var: '--space-md' },
                  { name: 'LG', value: '24px', var: '--space-lg' },
                  { name: 'XL', value: '32px', var: '--space-xl' },
                  { name: '2XL', value: '48px', var: '--space-2xl' },
                  { name: '3XL', value: '64px', var: '--space-3xl' },
                ].map((space) => (
                  <div key={space.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div style={{
                      width: space.value,
                      height: 24,
                      backgroundColor: 'var(--color-accent)',
                      borderRadius: 2,
                    }} />
                    <span className="text-small" style={{ minWidth: 60 }}>{space.name}</span>
                    <span className="text-small text-muted">{space.value}</span>
                    <code className="text-small" style={{ color: 'var(--color-gray-500)' }}>{space.var}</code>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Border Radius */}
          <Section title="Border Radius">
            <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
              {[
                { name: 'SM', value: '4px', radius: 'var(--radius-sm)' },
                { name: 'MD', value: '8px', radius: 'var(--radius-md)' },
                { name: 'LG', value: '12px', radius: 'var(--radius-lg)' },
                { name: 'XL', value: '16px', radius: 'var(--radius-xl)' },
                { name: 'Full', value: '9999px', radius: 'var(--radius-full)' },
              ].map((r) => (
                <div key={r.name} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    backgroundColor: 'var(--color-gray-200)',
                    borderRadius: r.radius,
                    marginBottom: 'var(--space-sm)',
                  }} />
                  <span className="text-small">{r.name}</span>
                  <br />
                  <span className="text-small text-muted">{r.value}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Shadows */}
          <Section title="Shadows">
            <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
              {[
                { name: 'SM', shadow: 'var(--shadow-sm)' },
                { name: 'MD', shadow: 'var(--shadow-md)' },
                { name: 'LG', shadow: 'var(--shadow-lg)' },
                { name: 'XL', shadow: 'var(--shadow-xl)' },
              ].map((s) => (
                <div key={s.name} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 100,
                    height: 100,
                    backgroundColor: 'var(--color-white)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: s.shadow,
                    marginBottom: 'var(--space-sm)',
                  }} />
                  <span className="text-small">Shadow {s.name}</span>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* COMPONENTS TAB */}
      {activeTab === 'components' && (
        <>
          {/* Buttons */}
          <Section title="Buttons">
            <Subsection title="Button Variants">
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="btn">Default</button>
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-dark">Dark</button>
                <button className="btn btn-outline">Outline</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-danger">Danger</button>
              </div>
            </Subsection>

            <Subsection title="Button Sizes">
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="btn btn-sm btn-primary">Small</button>
                <button className="btn btn-primary">Default</button>
                <button className="btn btn-lg btn-primary">Large</button>
              </div>
            </Subsection>

            <Subsection title="Button States">
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="btn btn-primary">Normal</button>
                <button className="btn btn-primary" style={{ opacity: 0.7 }}>Hover (simulated)</button>
                <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Disabled</button>
              </div>
            </Subsection>

            <Subsection title="Icon Buttons">
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Session
                </button>
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search
                </button>
              </div>
            </Subsection>
          </Section>

          {/* Cards */}
          <Section title="Cards">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
              <div className="card">
                <h4 style={{ marginBottom: 'var(--space-sm)' }}>DEFAULT CARD</h4>
                <p className="text-muted text-small" style={{ marginBottom: 0 }}>
                  Basic card with padding and border. Used as the primary container for content.
                </p>
              </div>

              <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
                <h4 style={{ marginBottom: 'var(--space-sm)' }}>ACCENT BORDER CARD</h4>
                <p className="text-muted text-small" style={{ marginBottom: 0 }}>
                  Card with accent left border. Used for coach feedback and highlights.
                </p>
              </div>

              <div className="card" style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                color: 'var(--color-white)',
              }}>
                <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-white)' }}>HERO CARD</h4>
                <p style={{ marginBottom: 0, color: 'var(--color-gray-300)', fontSize: 'var(--text-sm)' }}>
                  Dark gradient card for hero sections and emphasis.
                </p>
              </div>
            </div>
          </Section>

          {/* Belt Badges */}
          <Section title="Belt Badges">
            <Subsection title="All Belt Colors">
              <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
                {(['white', 'blue', 'purple', 'brown', 'black'] as BeltColor[]).map((belt) => (
                  <div key={belt} style={{ textAlign: 'center' }}>
                    <BeltBadge belt={belt} stripes={0} size="lg" />
                    <p className="text-small text-muted" style={{ marginTop: 'var(--space-xs)', marginBottom: 0, textTransform: 'capitalize' }}>
                      {belt}
                    </p>
                  </div>
                ))}
              </div>
            </Subsection>

            <Subsection title="With Stripes">
              <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
                {[0, 1, 2, 3, 4].map((stripes) => (
                  <div key={stripes} style={{ textAlign: 'center' }}>
                    <BeltBadge belt="blue" stripes={stripes as 0 | 1 | 2 | 3 | 4} size="lg" />
                    <p className="text-small text-muted" style={{ marginTop: 'var(--space-xs)', marginBottom: 0 }}>
                      {stripes} stripe{stripes !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </Subsection>

            <Subsection title="Sizes">
              <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <div key={size} style={{ textAlign: 'center' }}>
                    <BeltBadge belt="purple" stripes={2} size={size} />
                    <p className="text-small text-muted" style={{ marginTop: 'var(--space-xs)', marginBottom: 0 }}>
                      {size.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </Subsection>
          </Section>

          {/* Training Badges */}
          <Section title="Training Type Badges">
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              {(['gi', 'nogi', 'openmat', 'private', 'competition'] as TrainingType[]).map((type) => (
                <TrainingBadge key={type} type={type} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-md)' }}>
              {(['gi', 'nogi', 'openmat', 'private', 'competition'] as TrainingType[]).map((type) => (
                <TrainingBadge key={type} type={type} size="sm" />
              ))}
            </div>
          </Section>

          {/* Stat Cards */}
          <Section title="Stat Cards">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              <StatCard label="This Month" value={12} subtitle="Sessions" />
              <StatCard label="Current Streak" value={5} subtitle="Days" trend="up" trendValue="+2" />
              <StatCard label="Total Hours" value={312} subtitle="Mat time" />
              <StatCard label="This Month" value={12} subtitle="Sessions" accent />
            </div>
          </Section>

          {/* Progress Ring */}
          <Section title="Progress Ring">
            <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <ProgressRing percentage={25} size={80} />
                <p className="text-small text-muted" style={{ marginTop: 'var(--space-sm)' }}>25%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ProgressRing percentage={50} size={80} />
                <p className="text-small text-muted" style={{ marginTop: 'var(--space-sm)' }}>50%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ProgressRing percentage={75} size={80} />
                <p className="text-small text-muted" style={{ marginTop: 'var(--space-sm)' }}>75%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ProgressRing percentage={100} size={80} color="var(--color-success)" />
                <p className="text-small text-muted" style={{ marginTop: 'var(--space-sm)' }}>100%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ProgressRing percentage={68} size={120} strokeWidth={8}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 800,
                    color: 'var(--color-accent-text)',
                  }}>
                    68%
                  </span>
                </ProgressRing>
                <p className="text-small text-muted" style={{ marginTop: 'var(--space-sm)' }}>Large with custom content</p>
              </div>
            </div>
          </Section>

          {/* Progress Bars */}
          <Section title="Progress Bars">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {[25, 50, 75, 100].map((pct) => (
                <div key={pct}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="text-small">Progress</span>
                    <span className="text-small text-muted">{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Status Badges */}
          <Section title="Status Badges">
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <span className="status-badge status-success">Verified</span>
              <span className="status-badge status-warning">In Progress</span>
              <span className="status-badge status-error">Not Started</span>
              <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                backgroundColor: 'var(--color-info)',
                color: 'var(--color-white)',
              }}>Info</span>
            </div>
          </Section>

          {/* Form Elements */}
          <Section title="Form Elements">
            <div className="card" style={{ maxWidth: 500 }}>
              <div className="form-group">
                <label className="form-label">Text Input</label>
                <input type="text" className="form-input" placeholder="Enter text..." />
              </div>

              <div className="form-group">
                <label className="form-label">Select</label>
                <select className="form-select">
                  <option>Select an option</option>
                  <option>Gi Training</option>
                  <option>No-Gi Training</option>
                  <option>Open Mat</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Textarea</label>
                <textarea className="form-textarea" placeholder="Enter notes..."></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Number Input</label>
                <input type="number" className="form-input" placeholder="60" />
              </div>

              <div className="form-group">
                <label className="form-label">Input with Error</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ borderColor: 'var(--color-error)' }}
                  placeholder="Invalid input"
                />
                <span className="text-small" style={{ color: 'var(--color-error)', marginTop: 4, display: 'block' }}>
                  This field is required
                </span>
              </div>
            </div>
          </Section>
        </>
      )}

      {/* PATTERNS TAB */}
      {activeTab === 'patterns' && (
        <>
          {/* Card Headers */}
          <Section title="Card Headers">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Card Title</span>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-accent-text)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                  }}>View All</button>
                </div>
                <p className="text-muted text-small" style={{ marginBottom: 0 }}>Card content goes here...</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">With Badge</span>
                  <span className="status-badge status-success">Active</span>
                </div>
                <p className="text-muted text-small" style={{ marginBottom: 0 }}>Card content goes here...</p>
              </div>
            </div>
          </Section>

          {/* List Items */}
          <Section title="List Items">
            <div className="card" style={{ maxWidth: 500 }}>
              {[
                { title: 'Session Entry', subtitle: '90 min - 3 techniques', badge: 'gi' },
                { title: 'Yesterday', subtitle: '60 min - 2 techniques', badge: 'nogi' },
                { title: 'Dec 18', subtitle: '120 min - Open mat', badge: 'openmat' },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-md) 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--color-gray-200)' : 'none',
                  }}
                >
                  <div>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-small text-muted">{item.subtitle}</div>
                  </div>
                  <TrainingBadge type={item.badge as TrainingType} size="sm" />
                </div>
              ))}
            </div>
          </Section>

          {/* Empty States */}
          <Section title="Empty States">
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-gray-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-md)',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h4 style={{ marginBottom: 'var(--space-sm)' }}>NO SESSIONS YET</h4>
              <p className="text-muted text-small" style={{ marginBottom: 'var(--space-md)' }}>
                Start tracking your training journey by logging your first session.
              </p>
              <button className="btn btn-primary">Log First Session</button>
            </div>
          </Section>

          {/* Alert/Notice */}
          <Section title="Alerts & Notices">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: 500 }}>
              <div style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
              }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓</span>
                <span className="text-small">Requirement completed and verified by coach.</span>
              </div>

              <div style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
              }}>
                <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>○</span>
                <span className="text-small">15 of 18 months completed at current belt.</span>
              </div>

              <div style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--color-error)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
              }}>
                <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>!</span>
                <span className="text-small">Injury logged - consider rest or modified training.</span>
              </div>
            </div>
          </Section>

          {/* Metric Display */}
          <Section title="Metric Displays">
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-md)' }}>SPARRING RECORD</h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-md)',
                textAlign: 'center',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 800,
                    color: 'var(--color-success)',
                  }}>89</div>
                  <div className="text-small text-muted">Wins</div>
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 800,
                    color: 'var(--color-error)',
                  }}>67</div>
                  <div className="text-small text-muted">Losses</div>
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 800,
                    color: 'var(--color-gray-500)',
                  }}>45</div>
                  <div className="text-small text-muted">Draws</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Action Footer */}
          <Section title="Action Footers">
            <div className="card" style={{ maxWidth: 500 }}>
              <p className="text-small" style={{ marginBottom: 'var(--space-md)' }}>Form content would go here...</p>
              <div style={{
                display: 'flex',
                gap: 'var(--space-md)',
                paddingTop: 'var(--space-md)',
                borderTop: '1px solid var(--color-gray-200)',
              }}>
                <button className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }}>Save Session</button>
              </div>
            </div>
          </Section>

          {/* Selection Pills */}
          <Section title="Selection Pills">
            <Subsection title="Single Select">
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {['Gi', 'No-Gi', 'Open Mat', 'Private', 'Competition'].map((type, i) => (
                  <button
                    key={type}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--color-gray-100)',
                      color: i === 0 ? 'var(--color-white)' : 'var(--color-primary)',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </Subsection>

            <Subsection title="Multi Select (Tags)">
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {['Armbar', 'Triangle', 'Guard Pass', 'Sweep'].map((tech, i) => (
                  <span
                    key={tech}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: i < 2 ? 'var(--color-accent)' : 'var(--color-gray-100)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {tech}
                    {i < 2 && <span style={{ marginLeft: 4 }}>×</span>}
                  </span>
                ))}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px dashed var(--color-gray-300)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-500)',
                  cursor: 'pointer',
                }}>
                  + Add
                </span>
              </div>
            </Subsection>

            <Subsection title="Rating Scale (Energy/Mood)">
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    className="btn btn-sm"
                    style={{
                      width: 44,
                      height: 44,
                      padding: 0,
                      backgroundColor: level <= 3 ? 'var(--color-accent)' : 'var(--color-gray-100)',
                      color: level <= 3 ? 'var(--color-primary)' : 'var(--color-gray-600)',
                      fontWeight: 700,
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </Subsection>
          </Section>
        </>
      )}
    </div>
  );
}

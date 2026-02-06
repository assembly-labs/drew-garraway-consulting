'use client';

import { Heart, Users, Calendar, MapPin, Clock, Check, AlertCircle, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import FormField from '@/components/forms/FormField';

export default function UIGalleryPage() {
  return (
    <div className="py-12 md:py-16">
      <Container>
        <header className="mb-12">
          <SectionHeading
            headline="UI Component Gallery"
            subheadline="Reference guide for design consistency and development"
          />
          <p className="mt-4 text-center text-sm text-charcoal/60">
            This page is for internal reference only.
          </p>
        </header>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Colors</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {[
              { name: 'Forest', class: 'bg-forest', hex: '#2D5A27' },
              { name: 'Earth', class: 'bg-earth', hex: '#8B4513' },
              { name: 'Sage', class: 'bg-sage', hex: '#9CAF88' },
              { name: 'Wheat', class: 'bg-wheat', hex: '#F5DEB3' },
              { name: 'Charcoal', class: 'bg-charcoal', hex: '#333333' },
              { name: 'Cream', class: 'bg-cream', hex: '#FFFDD0' },
            ].map((color) => (
              <div key={color.name} className="overflow-hidden rounded-lg border border-charcoal/10">
                <div className={`h-20 ${color.class}`} />
                <div className="bg-white p-3">
                  <p className="font-medium text-charcoal">{color.name}</p>
                  <p className="text-xs text-charcoal/60">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Typography</h2>
          <div className="space-y-6 rounded-xl border border-charcoal/10 bg-white p-6">
            <div>
              <p className="mb-2 text-xs text-charcoal/50">Heading 1 (font-heading text-4xl)</p>
              <h1 className="font-heading text-4xl text-charcoal">The quick brown fox</h1>
            </div>
            <div>
              <p className="mb-2 text-xs text-charcoal/50">Heading 2 (font-heading text-3xl)</p>
              <h2 className="font-heading text-3xl text-charcoal">The quick brown fox</h2>
            </div>
            <div>
              <p className="mb-2 text-xs text-charcoal/50">Heading 3 (font-heading text-2xl)</p>
              <h3 className="font-heading text-2xl text-charcoal">The quick brown fox</h3>
            </div>
            <div>
              <p className="mb-2 text-xs text-charcoal/50">Heading 4 (font-heading text-xl)</p>
              <h4 className="font-heading text-xl text-charcoal">The quick brown fox</h4>
            </div>
            <div>
              <p className="mb-2 text-xs text-charcoal/50">Body (text-base)</p>
              <p className="text-base text-charcoal">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-charcoal/50">Small (text-sm)</p>
              <p className="text-sm text-charcoal/70">The quick brown fox jumps over the lazy dog.</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Buttons</h2>
          <div className="space-y-8 rounded-xl border border-charcoal/10 bg-white p-6">
            {/* Variants */}
            <div>
              <p className="mb-4 text-sm font-medium text-charcoal">Variants</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="mb-4 text-sm font-medium text-charcoal">Sizes</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <p className="mb-4 text-sm font-medium text-charcoal">States</p>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <p className="mb-4 text-sm font-medium text-charcoal">With Icons</p>
              <div className="flex flex-wrap gap-4">
                <Button>
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="secondary">
                  <Heart className="mr-2 h-4 w-4" /> Donate
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Form Fields</h2>
          <div className="space-y-6 rounded-xl border border-charcoal/10 bg-white p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="Text Input"
                name="demo-text"
                type="text"
                value=""
                onChange={() => {}}
                placeholder="Enter text..."
              />
              <FormField
                label="Email Input"
                name="demo-email"
                type="email"
                value=""
                onChange={() => {}}
                placeholder="email@example.com"
                required
              />
            </div>
            <FormField
              label="With Error"
              name="demo-error"
              type="text"
              value=""
              onChange={() => {}}
              placeholder="This field has an error"
              error="This field is required"
            />
            <FormField
              label="Textarea"
              name="demo-textarea"
              type="textarea"
              value=""
              onChange={() => {}}
              placeholder="Enter longer text..."
              rows={4}
            />
            <FormField
              label="Disabled Field"
              name="demo-disabled"
              type="text"
              value="Cannot edit this"
              onChange={() => {}}
              disabled
            />
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Cards</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Basic Card */}
            <div className="rounded-xl border border-charcoal/10 bg-white p-6">
              <h3 className="font-heading text-lg text-charcoal">Basic Card</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                A simple card with border and padding.
              </p>
            </div>

            {/* Card with Icon */}
            <div className="rounded-xl border border-charcoal/10 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg text-charcoal">Card with Icon</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Icon adds visual interest.
              </p>
            </div>

            {/* Highlighted Card */}
            <div className="rounded-xl border border-forest bg-forest/5 p-6">
              <h3 className="font-heading text-lg text-charcoal">Highlighted Card</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Emphasized with brand color.
              </p>
            </div>
          </div>
        </section>

        {/* Alert/Status Styles */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Alerts &amp; Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <Check className="h-5 w-5 text-green-600" />
              <p className="text-green-800">Success message style</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-800">Error message style</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-wheat p-4">
              <Clock className="h-5 w-5 text-charcoal/60" />
              <p className="text-charcoal/80">Info/pending message style</p>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Common Icons</h2>
          <p className="mb-4 text-sm text-charcoal/70">Using Lucide React icons</p>
          <div className="grid grid-cols-4 gap-4 rounded-xl border border-charcoal/10 bg-white p-6 sm:grid-cols-6 md:grid-cols-8">
            {[
              { icon: Heart, name: 'Heart' },
              { icon: Users, name: 'Users' },
              { icon: Calendar, name: 'Calendar' },
              { icon: MapPin, name: 'MapPin' },
              { icon: Clock, name: 'Clock' },
              { icon: Check, name: 'Check' },
              { icon: AlertCircle, name: 'AlertCircle' },
              { icon: ArrowRight, name: 'ArrowRight' },
            ].map(({ icon: Icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-2 p-3">
                <Icon className="h-6 w-6 text-charcoal" />
                <span className="text-xs text-charcoal/60">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section Heading */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Section Heading</h2>
          <div className="space-y-8 rounded-xl border border-charcoal/10 bg-white p-6">
            <div>
              <p className="mb-4 text-xs text-charcoal/50">Centered (default)</p>
              <SectionHeading
                headline="Section Title Here"
                subheadline="Optional descriptive text that provides additional context."
              />
            </div>
            <div>
              <p className="mb-4 text-xs text-charcoal/50">Left-aligned</p>
              <SectionHeading
                headline="Section Title Here"
                subheadline="Optional descriptive text that provides additional context."
                centered={false}
              />
            </div>
          </div>
        </section>

        {/* Spacing Reference */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl text-charcoal">Spacing Reference</h2>
          <div className="space-y-4 rounded-xl border border-charcoal/10 bg-white p-6">
            <p className="text-sm text-charcoal/70">Using Tailwind&apos;s default spacing scale:</p>
            <div className="flex items-end gap-2">
              {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
                <div key={n} className="flex flex-col items-center">
                  <div
                    className="bg-forest/30"
                    style={{ width: `${n * 4}px`, height: `${n * 4}px` }}
                  />
                  <span className="mt-2 text-xs text-charcoal/60">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Display, H1, H2, H3, Body, Stat, Badge, Typography } from '@/components/ui/typography';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Display className="mb-4">CAP Design System</Display>
          <Body className="text-lg">Championship Athletic Prospects - Component Showcase</Body>
        </div>

        {/* Typography Section */}
        <section className="mb-16">
          <H2 className="mb-8 border-b-2 border-gold-500 pb-2">Typography</H2>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-body text-navy-700 mb-2">Display (Bebas Neue)</p>
              <Display>Championship Display Text</Display>
            </div>

            <div>
              <p className="text-sm font-body text-navy-700 mb-2">H1 (Bebas Neue)</p>
              <H1>Main Heading Level 1</H1>
            </div>

            <div>
              <p className="text-sm font-body text-navy-700 mb-2">H2 (Bebas Neue)</p>
              <H2>Section Heading Level 2</H2>
            </div>

            <div>
              <p className="text-sm font-body text-navy-700 mb-2">H3 (Bebas Neue)</p>
              <H3>Subsection Heading Level 3</H3>
            </div>

            <div>
              <p className="text-sm font-body text-navy-700 mb-2">Body (Inter)</p>
              <Body>
                This is body text using Inter font. Perfect for paragraphs, descriptions, and general UI text.
                It provides excellent readability and works well at various sizes.
              </Body>
            </div>

            <div>
              <p className="text-sm font-body text-navy-700 mb-2">Stats (Roboto Mono)</p>
              <div className="flex gap-8">
                <Stat>1,234</Stat>
                <Typography variant="stat-lg">5,678</Typography>
              </div>
            </div>

            <div>
              <p className="text-sm font-body text-navy-700 mb-2">Badge (Graduate)</p>
              <div className="flex gap-4">
                <Badge>All-Star</Badge>
                <Typography variant="badge-lg">MVP 2024</Typography>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <H2 className="mb-8 border-b-2 border-gold-500 pb-2">Color Palette</H2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Gold */}
            <div>
              <h4 className="font-body font-semibold text-navy-900 mb-2">Gold</h4>
              <div className="space-y-2">
                <div className="h-16 bg-gold-50 rounded flex items-center justify-center text-sm">50</div>
                <div className="h-16 bg-gold-400 rounded flex items-center justify-center text-sm">400</div>
                <div className="h-16 bg-gold-500 rounded flex items-center justify-center text-sm">500</div>
                <div className="h-16 bg-gold-600 rounded flex items-center justify-center text-sm text-white">600</div>
                <div className="h-16 bg-gold-700 rounded flex items-center justify-center text-sm text-white">700</div>
              </div>
            </div>

            {/* Navy */}
            <div>
              <h4 className="font-body font-semibold text-navy-900 mb-2">Navy</h4>
              <div className="space-y-2">
                <div className="h-16 bg-navy-100 rounded flex items-center justify-center text-sm">100</div>
                <div className="h-16 bg-navy-500 rounded flex items-center justify-center text-sm text-white">500</div>
                <div className="h-16 bg-navy-700 rounded flex items-center justify-center text-sm text-white">700</div>
                <div className="h-16 bg-navy-800 rounded flex items-center justify-center text-sm text-white">800</div>
                <div className="h-16 bg-navy-900 rounded flex items-center justify-center text-sm text-white">900</div>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h4 className="font-body font-semibold text-navy-900 mb-2">Accents</h4>
              <div className="space-y-2">
                <div className="h-16 bg-electric-blue-500 rounded flex items-center justify-center text-sm text-white">Blue</div>
                <div className="h-16 bg-fire-red-500 rounded flex items-center justify-center text-sm text-white">Red</div>
                <div className="h-16 bg-green-500 rounded flex items-center justify-center text-sm text-white">Green</div>
              </div>
            </div>

            {/* Gradients */}
            <div>
              <h4 className="font-body font-semibold text-navy-900 mb-2">Gradients</h4>
              <div className="space-y-2">
                <div className="h-16 gradient-gold rounded flex items-center justify-center text-sm">Gold</div>
                <div className="h-16 gradient-championship rounded flex items-center justify-center text-sm text-white">Championship</div>
                <div className="h-16 bg-white border-2 border-gold-500 rounded flex items-center justify-center">
                  <span className="text-gradient-gold font-bold">Text Gradient</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <H2 className="mb-8 border-b-2 border-gold-500 pb-2">Buttons</H2>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="destructive">Destructive</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Small Primary</Button>
              <Button variant="primary" size="default">Default Primary</Button>
              <Button variant="primary" size="lg">Large Primary</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" disabled>Disabled Primary</Button>
              <Button variant="secondary" disabled>Disabled Secondary</Button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <H2 className="mb-8 border-b-2 border-gold-500 pb-2">Cards</H2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard Card */}
            <Card>
              <CardHeader>
                <div className="h-1 bg-gold-500 -mx-6 -mt-6 mb-4 rounded-t-lg"></div>
                <CardTitle className="font-display text-2xl uppercase">Standard Card</CardTitle>
                <CardDescription className="font-body">Default card with hover effect</CardDescription>
              </CardHeader>
              <CardContent>
                <Body className="text-sm">
                  This is a standard card component with subtle shadow and hover animation.
                </Body>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm" className="w-full">Action</Button>
              </CardFooter>
            </Card>

            {/* Premium Card */}
            <Card variant="premium">
              <CardHeader>
                <Badge className="mb-2">Premium</Badge>
                <CardTitle className="font-display text-2xl uppercase text-gold-500">Premium Card</CardTitle>
                <CardDescription className="font-body">Gold border with glow effect</CardDescription>
              </CardHeader>
              <CardContent>
                <Body className="text-sm">
                  Premium card variant with gold border and special shadow effect.
                </Body>
                <div className="mt-4">
                  <Stat>$28</Stat>
                  <p className="text-sm font-body text-navy-700">per pack</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm" className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            {/* Dark Card */}
            <Card variant="dark">
              <CardHeader>
                <CardTitle className="font-display text-2xl uppercase text-gold-500">Dark Card</CardTitle>
                <CardDescription className="font-body text-gray-300">Navy background variant</CardDescription>
              </CardHeader>
              <CardContent>
                <Body className="text-sm text-gray-200">
                  Dark card variant perfect for highlighting special content or CTAs.
                </Body>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Team Card Example */}
        <section className="mb-16">
          <H2 className="mb-8 border-b-2 border-gold-500 pb-2">Example: Team Card</H2>

          <div className="max-w-md">
            <Card className="hover:shadow-gold transition-shadow duration-300">
              <div className="h-2 bg-gradient-to-r from-gold-500 to-gold-600 -mx-6 -mt-6 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-5xl">⭐</div>
                  <div>
                    <CardTitle className="font-display text-2xl uppercase">Thunder FC</CardTitle>
                    <CardDescription className="font-body">Soccer • 12 Players</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Stat>15</Stat>
                    <p className="text-xs font-body text-navy-700">Cards</p>
                  </div>
                  <div>
                    <Stat>8</Stat>
                    <p className="text-xs font-body text-navy-700">Orders</p>
                  </div>
                  <div>
                    <Stat>4.9</Stat>
                    <p className="text-xs font-body text-navy-700">Rating</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="primary" size="sm" className="flex-1">View Cards</Button>
                <Button variant="ghost" size="sm" className="flex-1">Edit Team</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Special Effects */}
        <section className="mb-16">
          <H2 className="mb-8 border-b-2 border-gold-500 pb-2">Special Effects</H2>

          <div className="space-y-6">
            <div>
              <h4 className="font-body font-semibold text-navy-900 mb-4">Gold Glow Effects</h4>
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-white rounded-lg glow-gold flex items-center justify-center">
                  <span className="font-display text-2xl">GLOW</span>
                </div>
                <div className="w-32 h-32 bg-white rounded-lg glow-gold-lg flex items-center justify-center">
                  <span className="font-display text-2xl">GLOW LG</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-body font-semibold text-navy-900 mb-4">Text Gradients</h4>
              <div className="space-y-2">
                <h3 className="text-4xl font-display text-gradient-gold uppercase">Championship Gold</h3>
                <h3 className="text-4xl font-display uppercase bg-gradient-to-r from-gold-500 via-navy-900 to-fire-red-500 bg-clip-text text-transparent">
                  Multi-Color Gradient
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-navy-500/20">
          <div className="text-center">
            <Badge className="mb-2">CAP Design System v1.0</Badge>
            <Body className="text-sm">Ready for MVP Implementation</Body>
          </div>
        </footer>
      </div>
    </div>
  );
}
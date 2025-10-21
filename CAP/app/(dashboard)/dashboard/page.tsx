import { Metadata } from 'next';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { capConfig } from '@/lib/cap-config';

export const metadata: Metadata = {
  title: 'Dashboard | CAP',
  description: 'Your CAP dashboard',
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's teams
  const { data: teams } = user ? await supabase
    .from('teams')
    .select('*, children(count)')
    .eq('owner_id', user.id) : { data: null };

  const hasTeams = teams && teams.length > 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-display text-cap-secondary mb-2">
          Welcome to CAP!
        </h1>
        <p className="text-gray-600">
          {capConfig.messages.welcome}
        </p>
      </div>

      {!hasTeams ? (
        // Empty state
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started with Your First Team</CardTitle>
            <CardDescription>
              Create a team to start making championship trading cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="text-6xl">🏆</div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  You haven&apos;t created any teams yet. Let&apos;s get started!
                </p>
                <p className="text-sm text-gray-500">
                  It only takes 2 minutes to set up your first team.
                </p>
              </div>
              <Link href="/dashboard/teams/new">
                <Button variant="cap" size="lg">
                  Create Your First Team
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">1️⃣</div>
                <h3 className="font-semibold mb-1">Create Team</h3>
                <p className="text-sm text-gray-600">
                  Add team name, sport, and colors
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">2️⃣</div>
                <h3 className="font-semibold mb-1">Upload Photos</h3>
                <p className="text-sm text-gray-600">
                  Add photos and let AI enhance them
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">3️⃣</div>
                <h3 className="font-semibold mb-1">Design & Order</h3>
                <p className="text-sm text-gray-600">
                  Choose templates and order cards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Dashboard with teams
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display">Your Teams</h2>
            <Link href="/dashboard/teams/new">
              <Button variant="cap">Create New Team</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams?.map((team: any) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-cap-gold to-cap-secondary">
                  <CardTitle className="text-white">{team.name}</CardTitle>
                  <CardDescription className="text-white/90">
                    {team.sport} • {team.season || 'Current Season'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Champions:</span>
                      <span className="font-semibold">{team.children?.[0]?.count || 0}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/dashboard/teams/${team.id}/roster`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Roster
                        </Button>
                      </Link>
                      <Link href={`/dashboard/teams/${team.id}/photos`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Photos
                        </Button>
                      </Link>
                    </div>
                    <Link href={`/dashboard/teams/${team.id}/design`}>
                      <Button variant="cap" className="w-full">
                        Design Cards
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-12 grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600">
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cap-secondary">
              {teams?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600">
              Total Champions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cap-gold">
              {teams?.reduce((sum: number, team: any) => sum + (team.children?.[0]?.count || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600">
              Cards Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cap-accent">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600">
              Orders Placed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cap-success">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
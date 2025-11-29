import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  const memberData = {
    name: 'John Smith',
    currentBelt: 'Blue Belt',
    stripes: 3,
    nextBelt: 'Purple Belt',
    progressPercentage: 75,
    timeInBelt: '18 months',
  };

  const stats = {
    totalClasses: 156,
    thisMonth: 12,
    lastMonth: 15,
    avgPerMonth: 13,
    currentStreak: 4,
    longestStreak: 12,
  };

  const techniques = [
    { id: 1, name: 'Guard Passes', mastered: 8, total: 12, percentage: 67 },
    { id: 2, name: 'Submissions', mastered: 10, total: 15, percentage: 67 },
    { id: 3, name: 'Sweeps', mastered: 6, total: 10, percentage: 60 },
    { id: 4, name: 'Escapes', mastered: 7, total: 10, percentage: 70 },
    { id: 5, name: 'Takedowns', mastered: 4, total: 8, percentage: 50 },
  ];

  const milestones = [
    {
      id: 1,
      title: 'Earned 3rd Stripe',
      date: 'November 15, 2024',
      description: 'Demonstrated improved guard passing',
    },
    {
      id: 2,
      title: 'First Competition',
      date: 'October 5, 2024',
      description: 'Silver medal at local tournament',
    },
    {
      id: 3,
      title: '100 Classes',
      date: 'August 20, 2024',
      description: 'Reached 100 total classes',
    },
    {
      id: 4,
      title: 'Earned Blue Belt',
      date: 'June 1, 2024',
      description: 'Promoted from White to Blue Belt',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your BJJ journey</Text>
        </View>

        {/* Belt Progress Card */}
        <View style={styles.section}>
          <View style={styles.beltCard}>
            <Text style={styles.beltCardTitle}>Current Rank</Text>
            <View style={styles.beltInfo}>
              <View style={styles.beltBadge}>
                <Text style={styles.beltBadgeText}>
                  {memberData.currentBelt}
                </Text>
                <View style={styles.stripesContainer}>
                  {Array.from({ length: memberData.stripes }).map((_, i) => (
                    <View key={i} style={styles.stripe} />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.timeInBelt}>
              Time in belt: {memberData.timeInBelt}
            </Text>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  Progress to {memberData.nextBelt}
                </Text>
                <Text style={styles.progressPercentage}>
                  {memberData.progressPercentage}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${memberData.progressPercentage}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Training Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalClasses}</Text>
              <Text style={styles.statLabel}>Total Classes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.thisMonth}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>
          </View>
        </View>

        {/* Techniques Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technique Mastery</Text>
          <View style={styles.techniquesCard}>
            {techniques.map((technique) => (
              <View key={technique.id} style={styles.techniqueItem}>
                <View style={styles.techniqueHeader}>
                  <Text style={styles.techniqueName}>{technique.name}</Text>
                  <Text style={styles.techniqueCount}>
                    {technique.mastered}/{technique.total}
                  </Text>
                </View>
                <View style={styles.techniqueBarContainer}>
                  <View
                    style={[
                      styles.techniqueBarFill,
                      { width: `${technique.percentage}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <View style={styles.milestonesContainer}>
            {milestones.map((milestone, index) => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <View style={styles.milestoneTimeline}>
                  <View style={styles.milestoneCircle} />
                  {index < milestones.length - 1 && (
                    <View style={styles.milestoneLine} />
                  )}
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                  <Text style={styles.milestoneDate}>{milestone.date}</Text>
                  <Text style={styles.milestoneDescription}>
                    {milestone.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Goals</Text>
          <View style={styles.goalsCard}>
            <TouchableOpacity style={styles.goalItem}>
              <View style={styles.goalCheckbox} />
              <Text style={styles.goalText}>
                Train 4 times per week this month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goalItem}>
              <View style={styles.goalCheckbox} />
              <Text style={styles.goalText}>
                Master triangle choke from guard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goalItem}>
              <View style={styles.goalCheckbox} />
              <Text style={styles.goalText}>
                Compete in next local tournament
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#737373',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  beltCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  beltCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  beltInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  beltBadge: {
    alignItems: 'center',
  },
  beltBadgeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 8,
  },
  stripesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  stripe: {
    width: 30,
    height: 4,
    backgroundColor: '#000000',
  },
  timeInBelt: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressSection: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#737373',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#737373',
    textAlign: 'center',
  },
  techniquesCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  techniqueItem: {
    marginBottom: 16,
  },
  techniqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  techniqueName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  techniqueCount: {
    fontSize: 14,
    color: '#737373',
  },
  techniqueBarContainer: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  techniqueBarFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  milestonesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  milestoneTimeline: {
    alignItems: 'center',
    marginRight: 16,
  },
  milestoneCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000000',
    marginTop: 4,
  },
  milestoneLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  milestoneDate: {
    fontSize: 12,
    color: '#737373',
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#737373',
  },
  goalsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginRight: 12,
  },
  goalText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
});

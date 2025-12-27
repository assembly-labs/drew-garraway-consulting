import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const memberData = {
    name: 'John Smith',
    belt: 'Blue Belt',
    stripes: 3,
    gym: 'Alliance BJJ Paoli',
    memberSince: '2023',
  };

  const stats = {
    classesThisMonth: 12,
    totalClasses: 156,
    currentStreak: 4,
  };

  const nextClass = {
    name: 'Fundamentals',
    instructor: 'Professor Mike',
    time: 'Today, 6:00 PM',
    location: 'Main Mat',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{memberData.name}</Text>
          <Text style={styles.subtitle}>
            {memberData.belt} - {memberData.stripes} {memberData.stripes === 1 ? 'Stripe' : 'Stripes'}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.classesThisMonth}</Text>
            <Text style={styles.statLabel}>Classes This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalClasses}</Text>
            <Text style={styles.statLabel}>Total Classes</Text>
          </View>
        </View>

        {/* Next Class Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Class</Text>
          <View style={styles.classCard}>
            <View style={styles.classHeader}>
              <Text style={styles.className}>{nextClass.name}</Text>
              <Text style={styles.classTime}>{nextClass.time}</Text>
            </View>
            <Text style={styles.classDetail}>
              Instructor: {nextClass.instructor}
            </Text>
            <Text style={styles.classDetail}>
              Location: {nextClass.location}
            </Text>
            <TouchableOpacity
              style={styles.checkInButton}
              onPress={() => navigation.navigate('CheckIn')}
            >
              <Text style={styles.checkInButtonText}>Check In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Schedule')}
            >
              <Text style={styles.actionButtonText}>View Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Progress')}
            >
              <Text style={styles.actionButtonText}>Track Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gym Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Gym</Text>
          <View style={styles.gymCard}>
            <Text style={styles.gymName}>{memberData.gym}</Text>
            <Text style={styles.gymDetail}>Member since {memberData.memberSince}</Text>
            <Text style={styles.gymDetail}>123 Main Street, Paoli, PA 19301</Text>
            <Text style={styles.gymDetail}>Phone: (610) 555-0123</Text>
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
  greeting: {
    fontSize: 16,
    color: '#737373',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#737373',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  classTime: {
    fontSize: 14,
    color: '#737373',
  },
  classDetail: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 6,
  },
  checkInButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  checkInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  gymCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  gymName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  gymDetail: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 4,
  },
});

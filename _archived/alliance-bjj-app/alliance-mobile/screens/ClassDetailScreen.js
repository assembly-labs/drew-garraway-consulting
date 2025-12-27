import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClassDetailScreen({ route, navigation }) {
  // Mock data - in a real app, this would come from route.params
  const classData = {
    id: 1,
    name: 'Fundamentals',
    instructor: 'Professor Mike',
    time: '6:00 PM - 7:30 PM',
    date: 'Wednesday, November 27',
    level: 'All Levels',
    spots: 18,
    totalSpots: 20,
    location: 'Main Mat',
    duration: '90 minutes',
    description:
      'This fundamentals class covers essential BJJ techniques including guard work, passing, submissions, and escapes. Perfect for beginners and experienced practitioners alike.',
    requirements: [
      'Gi required',
      'Arrive 10 minutes early',
      'Trim fingernails and toenails',
      'Remove all jewelry',
    ],
    focusAreas: [
      'Guard retention',
      'Basic sweeps',
      'Fundamental submissions',
      'Positional escapes',
    ],
  };

  const instructor = {
    name: 'Professor Mike',
    rank: 'Black Belt, 3rd Degree',
    specialties: ['Fundamentals', 'Competition Training', 'Self Defense'],
    bio: 'Professor Mike has been training Brazilian Jiu-Jitsu for over 15 years and teaching for 10 years. He specializes in making complex techniques accessible to beginners.',
  };

  const attendees = [
    { id: 1, name: 'Sarah Johnson', belt: 'Purple Belt' },
    { id: 2, name: 'Mike Chen', belt: 'Blue Belt' },
    { id: 3, name: 'Emily Davis', belt: 'White Belt' },
    { id: 4, name: 'David Wilson', belt: 'Blue Belt' },
    { id: 5, name: 'Lisa Martinez', belt: 'White Belt' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{classData.name}</Text>
          <Text style={styles.date}>{classData.date}</Text>
        </View>

        {/* Class Info Card */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{classData.time}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{classData.duration}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{classData.location}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Level</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{classData.level}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Spots Available</Text>
              <Text style={styles.infoValue}>
                {classData.spots} / {classData.totalSpots}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Class</Text>
          <View style={styles.card}>
            <Text style={styles.description}>{classData.description}</Text>
          </View>
        </View>

        {/* Instructor Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructor</Text>
          <View style={styles.card}>
            <View style={styles.instructorHeader}>
              <View style={styles.instructorAvatar}>
                <Text style={styles.instructorAvatarText}>
                  {instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.instructorInfo}>
                <Text style={styles.instructorName}>{instructor.name}</Text>
                <Text style={styles.instructorRank}>{instructor.rank}</Text>
              </View>
            </View>
            <Text style={styles.instructorBio}>{instructor.bio}</Text>
            <View style={styles.specialtiesContainer}>
              <Text style={styles.specialtiesLabel}>Specialties:</Text>
              <View style={styles.specialtyChips}>
                {instructor.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyChip}>
                    <Text style={styles.specialtyChipText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Focus Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Areas</Text>
          <View style={styles.card}>
            {classData.focusAreas.map((area, index) => (
              <View key={index} style={styles.focusItem}>
                <View style={styles.bullet} />
                <Text style={styles.focusText}>{area}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.card}>
            {classData.requirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <View style={styles.checkIcon}>
                  <Text style={styles.checkIconText}>✓</Text>
                </View>
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Attendees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Registered Attendees ({attendees.length})
          </Text>
          <View style={styles.card}>
            {attendees.map((attendee) => (
              <View key={attendee.id} style={styles.attendeeItem}>
                <View style={styles.attendeeAvatar}>
                  <Text style={styles.attendeeAvatarText}>
                    {attendee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                </View>
                <View style={styles.attendeeInfo}>
                  <Text style={styles.attendeeName}>{attendee.name}</Text>
                  <Text style={styles.attendeeBelt}>{attendee.belt}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Register Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register for Class</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addToCalendarButton}>
            <Text style={styles.addToCalendarText}>Add to Calendar</Text>
          </TouchableOpacity>
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
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  date: {
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#737373',
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  levelBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  description: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  instructorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructorAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  instructorRank: {
    fontSize: 12,
    color: '#737373',
  },
  instructorBio: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 12,
  },
  specialtiesContainer: {
    marginTop: 8,
  },
  specialtiesLabel: {
    fontSize: 12,
    color: '#737373',
    marginBottom: 8,
  },
  specialtyChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  specialtyChipText: {
    fontSize: 12,
    color: '#000000',
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
    marginRight: 12,
  },
  focusText: {
    fontSize: 14,
    color: '#000000',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D4EDDA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIconText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: 'bold',
  },
  requirementText: {
    fontSize: 14,
    color: '#000000',
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendeeAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#737373',
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  attendeeBelt: {
    fontSize: 12,
    color: '#737373',
  },
  registerButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addToCalendarButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  addToCalendarText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

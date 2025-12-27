import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckInScreen() {
  const memberData = {
    name: 'John Smith',
    memberId: 'ALB-2023-1156',
    belt: 'Blue Belt',
    stripes: 3,
  };

  const todayClasses = [
    { id: 1, name: 'Fundamentals', time: '6:00 AM', status: 'Checked In' },
    { id: 2, name: 'Advanced Gi', time: '12:00 PM', status: 'Available' },
    { id: 3, name: 'No-Gi', time: '6:00 PM', status: 'Available' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Check-In</Text>
          <Text style={styles.subtitle}>
            Scan QR code at the front desk
          </Text>
        </View>

        {/* QR Code Section */}
        <View style={styles.section}>
          <View style={styles.qrContainer}>
            <View style={styles.qrCodePlaceholder}>
              {/* QR Code Placeholder */}
              <View style={styles.qrGrid}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.qrPixel,
                      Math.random() > 0.5 && styles.qrPixelFilled,
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.qrLabel}>Your Member QR Code</Text>
            <Text style={styles.memberId}>{memberData.memberId}</Text>
          </View>

          {/* Member Info Card */}
          <View style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{memberData.name}</Text>
              <Text style={styles.memberBelt}>
                {memberData.belt} - {memberData.stripes} Stripes
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Today's Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          {todayClasses.map((cls) => (
            <View key={cls.id} style={styles.classCard}>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classTime}>{cls.time}</Text>
              </View>
              {cls.status === 'Checked In' ? (
                <View style={styles.checkedInBadge}>
                  <Text style={styles.checkedInText}>Checked In</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.checkInButton}>
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Check-In History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Check-Ins</Text>
          <View style={styles.historyCard}>
            <View style={styles.historyItem}>
              <View>
                <Text style={styles.historyClass}>Fundamentals</Text>
                <Text style={styles.historyDate}>Monday, Nov 25</Text>
              </View>
              <Text style={styles.historyTime}>6:00 AM</Text>
            </View>
            <View style={styles.historyDivider} />
            <View style={styles.historyItem}>
              <View>
                <Text style={styles.historyClass}>No-Gi</Text>
                <Text style={styles.historyDate}>Friday, Nov 22</Text>
              </View>
              <Text style={styles.historyTime}>6:00 PM</Text>
            </View>
            <View style={styles.historyDivider} />
            <View style={styles.historyItem}>
              <View>
                <Text style={styles.historyClass}>Advanced Gi</Text>
                <Text style={styles.historyDate}>Wednesday, Nov 20</Text>
              </View>
              <Text style={styles.historyTime}>12:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How to Check In</Text>
            <Text style={styles.instructionText}>
              1. Show your QR code to the front desk scanner
            </Text>
            <Text style={styles.instructionText}>
              2. Wait for confirmation beep
            </Text>
            <Text style={styles.instructionText}>
              3. You're all set - head to the mat!
            </Text>
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
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 16,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrGrid: {
    width: 160,
    height: 160,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrPixel: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
  },
  qrPixelFilled: {
    backgroundColor: '#000000',
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  memberId: {
    fontSize: 14,
    color: '#737373',
    fontFamily: 'monospace',
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  memberBelt: {
    fontSize: 14,
    color: '#737373',
  },
  statusBadge: {
    backgroundColor: '#D4EDDA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  classTime: {
    fontSize: 14,
    color: '#737373',
  },
  checkInButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  checkInButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  checkedInBadge: {
    backgroundColor: '#D4EDDA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  checkedInText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: '600',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  historyClass: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#737373',
  },
  historyTime: {
    fontSize: 14,
    color: '#737373',
  },
  historyDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 8,
    lineHeight: 20,
  },
});

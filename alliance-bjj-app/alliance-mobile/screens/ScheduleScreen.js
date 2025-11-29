import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScheduleScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const filters = ['All', 'Fundamentals', 'Advanced', 'No-Gi', 'Open Mat'];

  const classes = [
    {
      id: 1,
      name: 'Fundamentals',
      instructor: 'Professor Mike',
      time: '6:00 AM - 7:00 AM',
      level: 'All Levels',
      spots: '15 spots available',
      type: 'Fundamentals',
    },
    {
      id: 2,
      name: 'Advanced Gi',
      instructor: 'Professor Sarah',
      time: '12:00 PM - 1:30 PM',
      level: 'Blue Belt+',
      spots: '12 spots available',
      type: 'Advanced',
    },
    {
      id: 3,
      name: 'Fundamentals',
      instructor: 'Coach Dave',
      time: '4:00 PM - 5:00 PM',
      level: 'All Levels',
      spots: '20 spots available',
      type: 'Fundamentals',
    },
    {
      id: 4,
      name: 'No-Gi',
      instructor: 'Professor Mike',
      time: '6:00 PM - 7:30 PM',
      level: 'All Levels',
      spots: '18 spots available',
      type: 'No-Gi',
    },
    {
      id: 5,
      name: 'Competition Training',
      instructor: 'Professor Sarah',
      time: '7:30 PM - 9:00 PM',
      level: 'Advanced',
      spots: '10 spots available',
      type: 'Advanced',
    },
  ];

  const filteredClasses = classes.filter(
    (cls) => selectedFilter === 'All' || cls.type === selectedFilter
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Class Schedule</Text>
          <Text style={styles.subtitle}>Alliance BJJ Paoli</Text>
        </View>

        {/* Day Selector */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
          >
            <TouchableOpacity
              style={[
                styles.dayChip,
                selectedDay === 'Today' && styles.dayChipActive,
              ]}
              onPress={() => setSelectedDay('Today')}
            >
              <Text
                style={[
                  styles.dayChipText,
                  selectedDay === 'Today' && styles.dayChipTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  selectedDay === day && styles.dayChipActive,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayChipText,
                    selectedDay === day && styles.dayChipTextActive,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Chips */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Classes List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedDay === 'Today' ? "Today's Classes" : `${selectedDay} Classes`}
          </Text>
          {filteredClasses.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={styles.classCard}
              onPress={() => navigation.navigate('ClassDetail', { class: cls })}
            >
              <View style={styles.classCardHeader}>
                <View style={styles.classCardLeft}>
                  <Text style={styles.classCardName}>{cls.name}</Text>
                  <Text style={styles.classCardInstructor}>
                    {cls.instructor}
                  </Text>
                </View>
                <View style={styles.classCardRight}>
                  <Text style={styles.classCardTime}>{cls.time}</Text>
                </View>
              </View>
              <View style={styles.classCardFooter}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{cls.level}</Text>
                </View>
                <Text style={styles.spotsText}>{cls.spots}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.section}>
          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Class Types</Text>
            <Text style={styles.legendItem}>
              Fundamentals - Basic techniques and movements
            </Text>
            <Text style={styles.legendItem}>
              Advanced - For experienced practitioners
            </Text>
            <Text style={styles.legendItem}>
              No-Gi - Training without the gi
            </Text>
            <Text style={styles.legendItem}>
              Open Mat - Free training and drilling
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
    marginTop: 16,
  },
  daySelector: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dayChipActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  dayChipText: {
    fontSize: 14,
    color: '#737373',
    fontWeight: '500',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterChipActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  filterChipText: {
    fontSize: 14,
    color: '#737373',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  classCardLeft: {
    flex: 1,
  },
  classCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  classCardInstructor: {
    fontSize: 14,
    color: '#737373',
  },
  classCardRight: {
    alignItems: 'flex-end',
  },
  classCardTime: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  classCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  spotsText: {
    fontSize: 12,
    color: '#737373',
  },
  legendCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  legendItem: {
    fontSize: 12,
    color: '#737373',
    marginBottom: 4,
  },
});

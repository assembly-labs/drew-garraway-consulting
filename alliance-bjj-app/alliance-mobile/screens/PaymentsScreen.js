import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('history');

  const membershipInfo = {
    plan: 'Unlimited Monthly',
    amount: '$159.00',
    nextBillingDate: 'December 1, 2024',
    status: 'Active',
    paymentMethod: 'Visa ending in 4242',
  };

  const paymentHistory = [
    {
      id: 1,
      date: 'November 1, 2024',
      amount: '$159.00',
      description: 'Monthly Membership - Unlimited',
      status: 'Paid',
      method: 'Visa ****4242',
      invoiceNumber: 'INV-2024-11-001',
    },
    {
      id: 2,
      date: 'October 1, 2024',
      amount: '$159.00',
      description: 'Monthly Membership - Unlimited',
      status: 'Paid',
      method: 'Visa ****4242',
      invoiceNumber: 'INV-2024-10-001',
    },
    {
      id: 3,
      date: 'September 1, 2024',
      amount: '$159.00',
      description: 'Monthly Membership - Unlimited',
      status: 'Paid',
      method: 'Visa ****4242',
      invoiceNumber: 'INV-2024-09-001',
    },
    {
      id: 4,
      date: 'August 1, 2024',
      amount: '$159.00',
      description: 'Monthly Membership - Unlimited',
      status: 'Paid',
      method: 'Visa ****4242',
      invoiceNumber: 'INV-2024-08-001',
    },
    {
      id: 5,
      date: 'July 1, 2024',
      amount: '$159.00',
      description: 'Monthly Membership - Unlimited',
      status: 'Paid',
      method: 'Visa ****4242',
      invoiceNumber: 'INV-2024-07-001',
    },
    {
      id: 6,
      date: 'June 1, 2024',
      amount: '$159.00',
      description: 'Monthly Membership - Unlimited',
      status: 'Paid',
      method: 'Visa ****4242',
      invoiceNumber: 'INV-2024-06-001',
    },
  ];

  const upcomingCharges = [
    {
      id: 1,
      date: 'December 1, 2024',
      amount: '$159.00',
      description: 'Monthly Membership - Unlimited',
    },
    {
      id: 2,
      date: 'January 1, 2025',
      amount: '$159.00',
      description: 'Monthly Membership - Unlimited',
    },
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
          <Text style={styles.title}>Payments</Text>
          <Text style={styles.subtitle}>Manage your billing</Text>
        </View>

        {/* Current Membership Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Membership</Text>
          <View style={styles.membershipCard}>
            <View style={styles.membershipHeader}>
              <Text style={styles.membershipPlan}>{membershipInfo.plan}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{membershipInfo.status}</Text>
              </View>
            </View>
            <View style={styles.membershipRow}>
              <Text style={styles.membershipLabel}>Monthly Amount</Text>
              <Text style={styles.membershipAmount}>
                {membershipInfo.amount}
              </Text>
            </View>
            <View style={styles.membershipRow}>
              <Text style={styles.membershipLabel}>Next Billing Date</Text>
              <Text style={styles.membershipValue}>
                {membershipInfo.nextBillingDate}
              </Text>
            </View>
            <View style={styles.membershipRow}>
              <Text style={styles.membershipLabel}>Payment Method</Text>
              <Text style={styles.membershipValue}>
                {membershipInfo.paymentMethod}
              </Text>
            </View>
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>
                Update Payment Method
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'history' && styles.tabActive,
            ]}
            onPress={() => setSelectedTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'history' && styles.tabTextActive,
              ]}
            >
              Payment History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'upcoming' && styles.tabActive,
            ]}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'upcoming' && styles.tabTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on selected tab */}
        {selectedTab === 'history' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            {paymentHistory.map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <Text style={styles.paymentDate}>{payment.date}</Text>
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>{payment.status}</Text>
                  </View>
                </View>
                <Text style={styles.paymentDescription}>
                  {payment.description}
                </Text>
                <View style={styles.paymentFooter}>
                  <Text style={styles.paymentMethod}>{payment.method}</Text>
                  <Text style={styles.paymentAmount}>{payment.amount}</Text>
                </View>
                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceNumber}>
                    {payment.invoiceNumber}
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.downloadText}>Download Receipt</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Charges</Text>
            {upcomingCharges.map((charge) => (
              <View key={charge.id} style={styles.upcomingCard}>
                <View style={styles.upcomingHeader}>
                  <Text style={styles.upcomingDate}>{charge.date}</Text>
                  <Text style={styles.upcomingAmount}>{charge.amount}</Text>
                </View>
                <Text style={styles.upcomingDescription}>
                  {charge.description}
                </Text>
              </View>
            ))}

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Automatic Billing</Text>
              <Text style={styles.infoText}>
                Your membership will automatically renew on the 1st of each
                month. You'll receive an email receipt after each successful
                payment.
              </Text>
            </View>
          </View>
        )}

        {/* Summary */}
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>2024 Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Payments</Text>
              <Text style={styles.summaryValue}>11</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount Paid</Text>
              <Text style={styles.summaryValue}>$1,749.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Member Since</Text>
              <Text style={styles.summaryValue}>January 2023</Text>
            </View>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              If you have questions about your billing or need to make changes
              to your membership, please contact us.
            </Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Support</Text>
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
  membershipCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  membershipPlan: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
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
  membershipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  membershipLabel: {
    fontSize: 14,
    color: '#737373',
  },
  membershipAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  membershipValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tabActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    color: '#737373',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  paidBadge: {
    backgroundColor: '#D4EDDA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paidText: {
    fontSize: 11,
    color: '#155724',
    fontWeight: '600',
  },
  paymentDescription: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 8,
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#737373',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  invoiceNumber: {
    fontSize: 11,
    color: '#737373',
    fontFamily: 'monospace',
  },
  downloadText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  upcomingCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  upcomingDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  upcomingAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  upcomingDescription: {
    fontSize: 14,
    color: '#737373',
  },
  infoCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#737373',
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#737373',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  helpCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#737373',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

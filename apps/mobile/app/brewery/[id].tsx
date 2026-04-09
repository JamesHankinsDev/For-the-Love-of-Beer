import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Spacing } from '../../constants/theme';

export default function BreweryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* TODO: Fetch brewery data by ID */}
      <Text style={styles.name}>Brewery Details</Text>
      <Text style={styles.meta}>Loading brewery {id}...</Text>

      <TouchableOpacity style={styles.checkInButton}>
        <Text style={styles.checkInText}>Check In & Stamp Your Passport</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  meta: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  checkInButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  checkInText: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

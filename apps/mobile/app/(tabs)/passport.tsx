import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

export default function PassportScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Passport</Text>
      <Text style={styles.subtitle}>
        Your brewery stamps will appear here. Visit a brewery to collect your first stamp!
      </Text>
      {/* TODO: Passport book UI with stamp grid */}
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📖</Text>
        <Text style={styles.emptyText}>No stamps yet</Text>
        <Text style={styles.emptyHint}>
          Visit a brewery and check in to get your first stamp!
        </Text>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

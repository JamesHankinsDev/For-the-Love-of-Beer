import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Breweries</Text>
      <Text style={styles.subtitle}>
        Find craft breweries near you and start collecting stamps!
      </Text>
      {/* TODO: Map view with brewery markers */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>Map View Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  mapPlaceholder: {
    flex: 1,
    margin: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

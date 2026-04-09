import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Breweries</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, city, or state..."
        placeholderTextColor={Colors.textLight}
      />
      {/* TODO: Search results list */}
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Search for your favorite breweries</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

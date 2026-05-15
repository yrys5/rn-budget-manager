import { StyleSheet, Text, View } from 'react-native';

type SectionHeaderProps = {
  action?: string;
  title: string;
};

export function SectionHeader({ action, title }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    color: '#157348',
    fontSize: 13,
    fontWeight: '800',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#10251F',
    fontSize: 18,
    fontWeight: '800',
  },
});

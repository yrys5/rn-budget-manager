import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type IconName = ComponentProps<typeof Ionicons>['name'];

type PrimaryButtonProps = PropsWithChildren<{
  icon?: IconName;
  onPress: () => void;
}>;

export function PrimaryButton({ children, icon, onPress }: PrimaryButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{children}</Text>
      {icon ? <Ionicons name={icon} size={20} color="#FFFFFF" /> : null}
    </Pressable>
  );
}

type IconButtonProps = {
  accessibilityLabel: string;
  color?: string;
  icon: IconName;
  onPress: () => void;
};

export function IconButton({
  accessibilityLabel,
  color = '#40534B',
  icon,
  onPress,
}: IconButtonProps) {
  return (
    <Pressable accessibilityLabel={accessibilityLabel} onPress={onPress} style={styles.iconButton}>
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#EDF4F0',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#10251F',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

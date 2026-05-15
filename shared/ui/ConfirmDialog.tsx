import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type ConfirmDialogProps = {
  confirmLabel?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  visible: boolean;
};

export function ConfirmDialog({
  confirmLabel = 'Usuń',
  message,
  onCancel,
  onConfirm,
  title,
  visible,
}: ConfirmDialogProps) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Anuluj</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#EDF4F0',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 12,
  },
  cancelText: {
    color: '#40534B',
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    gap: 14,
    padding: 18,
    width: '86%',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: '#B73E3E',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 12,
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  message: {
    color: '#5D6B66',
    fontSize: 14,
    lineHeight: 20,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 37, 31, 0.42)',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#10251F',
    fontSize: 18,
    fontWeight: '800',
  },
});

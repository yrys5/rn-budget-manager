import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function AppTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="dashboard">
        <Label>Pulpit</Label>
        <Icon sf="square.grid.2x2" drawable="dashboard" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="budgets">
        <Label>Budżety</Label>
        <Icon sf="wallet.pass" drawable="account_balance_wallet" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transactions">
        <Label>Transakcje</Label>
        <Icon sf="arrow.left.arrow.right" drawable="swap_horiz" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="goals">
        <Label>Cele</Label>
        <Icon sf="flag" drawable="flag" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="family">
        <Label>Rodzina</Label>
        <Icon sf="person.2" drawable="groups" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

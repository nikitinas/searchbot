import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TabParamList } from '@/types';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { palette } from '@/theme/colors';

const Tab = createBottomTabNavigator<TabParamList>();

export const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#0F0F15',
        borderTopColor: 'transparent',
      },
      tabBarActiveTintColor: palette.primary,
      tabBarInactiveTintColor: palette.muted,
      tabBarIcon: ({ color, size }) => {
        const iconMap: Record<string, string> = {
          Dashboard: 'home-analytics',
          History: 'clock-time-four-outline',
          Profile: 'account-circle',
        };
        const iconName = iconMap[route.name] ?? 'circle';
        return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../constants/colors'; // Ensure this path is correct and the file exports a 'background' property

export default function SafeScreen({children}) {
    const insets = useSafeAreaInsets();
    
  return (
    <View style={[styles.container,{paddingTop: insets.top}]}>
        {children}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../../constants/theme';
import { data, type Data } from '../../data/screens';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/Button';

const RenderItem = ({
  item,
  index,
  x,
  flatListRef,
  flatListIndex,
  dataLength,
  onLastScreen,
}: {
  item: Data;
  index: number;
  x: SharedValue<number>;
  flatListRef: RefObject<FlatList>;
  flatListIndex: SharedValue<number>;
  dataLength: number;
  onLastScreen: () => void;
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const navigation = useNavigation();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      width: SCREEN_WIDTH * 0.8,
      height: SCREEN_WIDTH * 0.8,
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <Animated.Image source={item.image} style={imageAnimatedStyle} />

      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemText}>{item.text}</Text>
        
      </Animated.View>
    </View>
  );
};

const onViewableItemsChanged = (flatListIndex: SharedValue<number>) => ({
  viewableItems,
}: {
  viewableItems: Array<ViewToken>;
}) => {
  if (viewableItems.length > 0) {
    flatListIndex.value = viewableItems[0].index ?? 0;
  }
};

export default function Onboarding() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const flatListRef = useAnimatedRef<FlatList>();
  const navigation = useNavigation();

  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef as any}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <RenderItem
            index={index}
            item={item}
            x={x}
            flatListRef={flatListRef}
            flatListIndex={flatListIndex}
            dataLength={data.length}
            onLastScreen={() => navigation.navigate('auth/login')}
          />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged(flatListIndex)}
      />

      <View style={styles.footerContainer}>
        <Pagination data={data} screenWidth={SCREEN_WIDTH} x={x} />

        <Button
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
          onLastScreen={() => navigation.navigate('auth/login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    
  },
  itemContainer: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20, 
  },
  itemTitle: {
    color: theme.colors.textColor,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemText: {
    color: theme.colors.textColor,
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 30,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
  },
  getStartedButton: {
    backgroundColor: '#AD40AF',
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
  },
  getStartedButtonText: {
    color: theme.colors.textHighlightColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
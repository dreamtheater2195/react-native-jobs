import React, { Component } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager, Platform } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;
class Swipe extends Component {
    static defaultProps = {
        onSwipeRight: () => { },
        onSwipeLeft: () => { },
        keyProp: 'id'
    }
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });

        this.state = {
            panResponder,
            position,
            currentIndex: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 })
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.currentIndex];
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0 });
        this.setState({ currentIndex: this.state.currentIndex + 1 });
    }

    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        }
    }
    renderCards = () => {
        if (this.state.currentIndex >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }
        const deck = this.props.data.map((item, index) => {
            if (index < this.state.currentIndex) {
                return null;
            }
            if (index === this.state.currentIndex) {
                return (
                    <Animated.View
                        key={item[this.props.keyProp]}
                        style={[this.getCardStyle(), styles.cardStyle]}
                    >
                        {this.props.renderCard(item, this.state.panResponder.panHandlers)}
                    </Animated.View>
                )
            }
            return (
                <Animated.View
                    key={item[this.props.keyProp]}
                    style={[styles.cardStyle, { top: 10 * (index - this.state.currentIndex), zIndex: -index }]}>
                    {this.props.renderCard(item, this.state.panResponder.panHandlers)}
                </Animated.View>
            )
        });

        return Platform.OS === 'android' ? deck : deck.reverse();
    }
    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
}

export default Swipe;
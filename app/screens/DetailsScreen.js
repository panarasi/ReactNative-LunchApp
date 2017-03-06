import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    Animated,
    TouchableHighlight
} from 'react-native';

import Service from './../data/service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Button from './Button';

const shorten = (name, n) => name.substr(0, n - 1) + (name.length > n ? '...' : '')

export default class DetailsScreen extends Component {
    static navigationOptions = {
        title: ({ state }) => shorten(state.params.item.name, 25),
        header: ({ goBack, state: {params: { item, type }}, navigate }) => ({
            left: (<TouchableHighlight onPress={() => goBack()}>
                <MaterialIcons name="chevron-left" size={30} />
            </TouchableHighlight>),
            right: (<TouchableHighlight onPress={() => navigate('Purchase', { item, type })}>
                <Ionicons name="ios-cart" size={30} style={{ margin: 10 }} />
            </TouchableHighlight>),
            style: {}
        })
    }

    state = {
        scrollY: new Animated.Value(0),
    }

    _renderFoodDetails() {
        const { item, type } = this.props.navigation.state.params;
        return (<View>
            <View style={styles.cardLabel}>
                <Ionicons name="ios-basket" size={30} />
                <Text style={styles.cardLabelText}>Ingredients</Text>
            </View>
            {item.ingredients.map(({ quantity, name }, i) =>
                <View style={styles.cardBodyText} key={i}>
                    <Ionicons name="ios-color-fill-outline" size={15} style={{ alignSelf: 'center', marginRight: 5 }} />
                    <Text style={{ fontSize: 16, color: '#995555' }}> {quantity} </Text>
                    <Text style={{ fontSize: 16 }}>{name}</Text>
                </View>)
            }

            <View style={styles.cardLabel}>
                <Ionicons name="ios-color-wand-outline" size={30} />
                <Text style={styles.cardLabelText}>Preparation Steps</Text>
            </View>
            {item.steps.map((step, i) =>
                <View style={styles.cardBodyText} key={i}>
                    <Text style={styles.cardNumber}>
                        {i + 1}
                    </Text>
                    <Text style={{ fontSize: 16, alignSelf: 'center' }}>{step}</Text>
                </View>
            )}
        </View>);
    }

    _renderWineDetails() {
        const { item, type } = this.props.navigation.state.params;
        return (<View>
            <View style={styles.cardLabel}>
                <Ionicons name="ios-map-outline" size={30} />
                <Text style={styles.cardLabelText}>Location</Text>
            </View>
            <View style={styles.cardBodyText}>
                <Text style={{ fontSize: 16, alignSelf: 'center' }}>
                    From the year {item.year} with {item.grapes} grapes
                    found in {item.region}, {item.country}.
                </Text>
            </View>
            <View style={styles.cardLabel}>
                <Ionicons name="ios-chatbubbles-outline" size={30} />
                <Text style={styles.cardLabelText}>Description</Text>
            </View>
            <View style={styles.cardBodyText}>
                <Text style={{ fontSize: 16, alignSelf: 'center' }}>{item.description}</Text>
            </View>
        </View>);
    }

    render() {
        const { item, type } = this.props.navigation.state.params;
        let { scrollY } = this.state;

        return (
            <View style={styles.container}>
                <View style={{ flex: 1, marginTop: -50 }}>
                    {this._renderHeroHeader()}
                    <Animated.ScrollView
                        scrollEventThrottle={16}
                        style={StyleSheet.absoluteFill}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}>
                        <View style={styles.heroSpacer} />

                        <View style={styles.contentContainerStyle}>
                            <Text style={{ fontSize: 25, margin: 15, marginBottom: 5 }}>
                                {item.name}
                            </Text>
                            <Text style={{ fontSize: 18, marginLeft: 15 }}>
                                {item.category}{item.region} {item.country}
                            </Text>
                            <Text style={{ fontSize: 20, color: 'green', margin: 15 }}>
                                Price: $ {item.price}.00
                            </Text>
                            <Button
                                title='Buy'
                                icon="ios-cart"
                                onPress={() => this.props.navigation.navigate('Purchase', { item, type })}
                            />
                            {type === 'Food' ? this._renderFoodDetails() : this._renderWineDetails()}
                        </View>
                    </Animated.ScrollView>
                </View>

            </View>
        );
    }
    _renderHeroHeader() {
        const { item, type } = this.props.navigation.state.params;
        let { scrollY } = this.state;

        let logoScale = scrollY.interpolate({ inputRange: [-150, 0, 150], outputRange: [1.5, 1, 1], });
        let logoTranslateY = scrollY.interpolate({ inputRange: [-150, 0, 150], outputRange: [40, 0, -40], });
        let logoOpacity = scrollY.interpolate({ inputRange: [-150, 0, 200, 400], outputRange: [1, 1, 0.2, 0.2], });
        let heroBackgroundTranslateY = scrollY.interpolate({ inputRange: [-1, 0, 200, 201], outputRange: [0, 0, -400, -400], });
        let gradientTranslateY = scrollY.interpolate({ inputRange: [-1, 0, 1], outputRange: [1, 0, -1], });

        return (
            <View>
                <Animated.View style={[
                    styles.heroBackground,
                    { transform: [{ translateY: heroBackgroundTranslateY }] }]}
                />

                <View style={styles.hero}>
                    <Animated.Image
                        source={{ uri: item.imageURL }}
                        style={[styles.heroImage, { opacity: logoOpacity, transform: [{ scale: logoScale }, { translateY: logoTranslateY }] }]}
                        resizeMode="cover"
                    />
                </View>
            </View>
        );
    }
}

const HeroHeight = 370;
const Layout = {
    window: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    heroSpacer: {
        width: Layout.window.width,
        height: HeroHeight,
        backgroundColor: 'transparent',
    },
    contentContainerStyle: {
        paddingBottom: 20,
        backgroundColor: '#FAFAFA',
        minHeight: Layout.window.height - HeroHeight,
    },
    cardBody: {
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    cardLabel: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        marginTop: 20,
        paddingBottom: 10,
        paddingTop: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#E8E8E8',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 5
    },
    cardLabelText: {
        alignSelf: 'center',
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#313131',
    },
    cardBodyText: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 3,
        flexDirection: 'row'
    },
    cardNumber: {
        fontSize: 14,
        marginRight: 5,
        marginBottom: 5,
        padding: 5,
        width: 30,
        textAlign: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#333',
        borderRadius: 5
    },
    hero: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HeroHeight,
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImage: {
        width: Layout.window.width,
        height: HeroHeight,
        marginTop: 80,
    },
    heroBackground: {
        height: HeroHeight + 250,
    },
});
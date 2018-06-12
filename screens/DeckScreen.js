import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Swipe from '../components/Swipe';
import { MapView } from 'expo';
import { Card, Button } from 'react-native-elements';
import * as actions from '../actions';
class DeckScreen extends Component {
    renderCard = (job) => {
        const { title, company, created_at, description } = job;
        const initialRegion = {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
        return (
            <Card title={title}>
                <View style={{ height: 300 }}>
                    <MapView
                        scrollEnabled={false}
                        style={{ flex: 1 }}
                        cacheEnabled={Platform.OS === 'android'}
                        initialRegion={initialRegion}
                    >
                    </MapView>
                </View>
                <View style={styles.detailWrapper}>
                    <Text>{company}</Text>
                    <Text>{created_at}</Text>
                </View>
                <ScrollView>
                    <Text>
                        {description.replace(/(<([^>]+)>)/ig, "")}
                    </Text>
                </ScrollView>
            </Card>
        )
    }
    renderNoMoreCards = () => {
        return (
            <Card title="No More Jobs">
                <Button
                    title="Back To Map"
                    large
                    icon={{ name: 'my-location' }}
                    backgroundColor="#03A9F4"
                    onPress={() => this.props.navigation.navigate('map')}
                />
            </Card>
        )
    }
    render() {
        return (
            <View style={{ marginTop: 10 }}>
                <Swipe
                    data={this.props.jobs}
                    renderCard={this.renderCard}
                    renderNoMoreCards={this.renderNoMoreCards}
                    keyProp="id"
                    onSwipeRight={job => this.props.likeJob(job)}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    detailWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    }
})

const mapStateToProps = ({ jobs }) => {
    return { jobs: jobs.results };
}
export default connect(mapStateToProps, actions)(DeckScreen);
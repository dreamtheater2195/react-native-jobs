import React, { Component } from 'react';
import { ScrollView, Text, Platform, StyleSheet, View, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button } from 'react-native-elements';
import { MapView } from 'expo';
import moment from 'moment';
class ReviewScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Review Jobs',
            headerRight: (
                <Button
                    title="Settings"
                    onPress={() => navigation.navigate('settings')}
                    backgroundColor="rgba(0,0,0,0)"
                    color="rgba(0,122,255,1)"
                />
            ),
            headerStyle: {
                marginTop: Platform.OS === 'android' ? 24 : 0
            }
        };
    }

    renderLikedJobs = () => {
        return this.props.likedJobs.map((job) => {
            const { id, company, created_at, url, title } = job;
            const initialRegion = {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
            return (
                <Card key={id} title={title}>
                    <View style={{ height: 200 }}>
                        <MapView
                            scrollEnabled={false}
                            style={{ flex: 1 }}
                            cacheEnabled={Platform.OS === 'android'}
                            initialRegion={initialRegion}
                        >
                        </MapView>
                        <View style={styles.detailWrapper}>
                            <Text style={styles.italics}>{company}</Text>
                            <Text style={styles.italics}>
                                {moment(created_at, "ddd MMM DD hh:mm:ss z YYYY").fromNow()}
                            </Text>
                        </View>
                        <Button
                            title="Apply Now"
                            backgroundColor="#03A9F4"
                            onPress={() => Linking.openURL(url)}
                        />
                    </View>
                </Card>
            )
        })
    }
    render() {
        return (
            <ScrollView>
                {this.renderLikedJobs()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    detailWrapper: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    italics: {
        fontStyle: 'italic'
    }
})

const mapStateToProps = (state) => {
    return {
        likedJobs: state.likes
    }
}
export default connect(mapStateToProps)(ReviewScreen);
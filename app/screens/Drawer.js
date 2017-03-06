import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView
} from 'react-native';

import Button from './Button'

import Ionicons from 'react-native-vector-icons/Ionicons';
import Metadata from './../../package.json';

import CodePush from 'react-native-code-push';

export default class Drawer extends Component {
    dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    state = {
        codepushLogs: ['Click the button to start Code Push']
    }
    codepushSync() {
        this.setState({ codepushLogs: [`Starting ${new Date()}`] })
        CodePush.sync({
            installMode: CodePush.InstallMode.IMMEDIATE,
            updateDialog: true
        }, status => {
            for (var key in CodePush.SyncStatus) {
                if (status === CodePush.SyncStatus[key]) {
                    this.setState(({ codepushLogs }) => ({ codepushLogs: [...codepushLogs, key.replace(/_/g, ' ').toLocaleLowerCase()] }))
                    break;
                }
            }
        });
    }
    render() {
        return (<View style={styles.container}>
            <View style={styles.logoContainer}>
                <Ionicons size={150} name='ios-basket-outline' color='#333' />
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{Metadata.name} </Text>
                    <Text>{Metadata.version}</Text>
                </View>
                <Text style={{ fontSize: 16, margin: 15, color: '#333' }}>{Metadata.description}</Text>
            </View >
            <View style={{ flex: 1 }}>
                <Button icon="ios-sync" title="Code Push Sync" onPress={() => this.codepushSync()} />
                <ListView
                    style={{ margin: 15 }}
                    dataSource={this.dataSource.cloneWithRows(this.state.codepushLogs)}
                    renderRow={item => (<View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Ionicons name="ios-done-all" size={30} />
                        <Text style={{ marginLeft: 5 }}>{item}</Text>
                    </View>)}
                />
            </View>
        </View >);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainer: {
        alignItems: 'center',
        backgroundColor: '#ddd',
        marginBottom: 20,
        paddingTop: 20
    }
});
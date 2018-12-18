import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Spinner, Button, Text, Picker } from "native-base";
import { Table, Row } from 'react-native-table-component';
import moment from "moment";

export default class ExampleThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliceIndex: 100,
      data: [],
      selected: "PZ001",
      loading: true,
      tableHead: ['OBJECTID', 'id', 'label', 'timestamp_from', 'timestamp_to', 'unit_NO2', 'unit_P', 'unit_PM10', 'unit_RH', 'unit_T', 'value_NO2', 'value_P', 'value_PM10', 'value_RH', 'value_T'],
      widthArr: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
    }
  }
  onValueChange = (value) => {
    this.setState({
      selected: value
    });
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch("https://services1.arcgis.com/3YlK2vfHGZtonb1r/arcgis/rest/services/RIVM_Sensors_Zwolle_(gegevens_per_uur_UTC0)/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json").then(arr => arr.json()).then((arr => {
      const tableData = [];
      for (let i = 0; i < arr.features.length; i += 1) {
        const rowData = [];
        Object.keys(arr.features[i].attributes).forEach(function (key) {
          if (key === 'timestamp_from' || key === 'timestamp_to') {
            rowData.push(`${moment(arr.features[i].attributes[key]).format('MMM Do YY')}`);
          }
          else {
            rowData.push(`${arr.features[i].attributes[key]}`);
          }
        });
        tableData.push(rowData);
      }
      this.setState({
        data: tableData,
        loading: false
      })
    }))
  }

  onChange = () => {
    this.setState({
      sliceIndex: this.state.sliceIndex + 100
    })
  }

  render() {
    const state = this.state;
    let intialArray = this.state.data.filter(arr=>arr[2] === this.state.selected);
    
    return (
      <ScrollView horizontal={!this.state.loading} style={{ flex: 1 }}>
        {this.state.loading ?
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Spinner /></View> :
          <View>
            <View>
              <Text>Select Sensor</Text>
            <Picker
              note
              mode="dropdown"
              style={{ width: 120 }}
              selectedValue={this.state.selected}
              onValueChange={this.onValueChange.bind(this)}
            >
              <Picker.Item label="PZ001" value="PZ001" />
              <Picker.Item label="PZ002" value="PZ002" />
              <Picker.Item label="PZ005" value="PZ005" />
              <Picker.Item label="PZ006" value="PZ006" />
            </Picker>
            </View>
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text} />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                {
                  intialArray.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={state.widthArr}
                      style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
              <Button style={{ marginTop: 10, marginLeft: 10, zIndex: 100 }} primary onPress={() => this.onChange()}>
                <Text>Show More!</Text>
              </Button>
            </ScrollView>
          </View>
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1, zIndex: -1000 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});
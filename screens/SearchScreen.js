import * as React from 'react';
import {Text, View} from 'react-native'

export default class SearchScreen extends React.Component{
  render()
  {
    return(
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor:'red'}}>
        <Text>Search</Text>
      </View>
    )
  }
}
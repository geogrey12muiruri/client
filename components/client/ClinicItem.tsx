import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'

interface Clinic {
  attributes: {
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    Name: string;
    Address: string;
  };
}

interface ClinicItemProps {
  clinic: Clinic;
}

export default function ClinicItem({ clinic }: ClinicItemProps) {
  return (
    <View style={{width:200,  
      borderWidth:1,
       borderColor:Colors.LIGHT_GRAY,
       borderRadius:10,
       marginRight:10,}}>
    <Image
    source={{uri:clinic.attributes.image.data.attributes.url}}
    style={{width: '100%', height:100, borderTopLeftRadius:10,
    borderBottomRightRadius:10 }}
    />
    <View style={{padding:4}}>
        <Text style={{fontFamily: 'Inter-Black-Semi', fontSize:16}}>{clinic.attributes.Name}</Text>
        <Text style={{color:Colors.GRAY}}>{clinic.attributes.Address}</Text>
    </View>
    </View>
  )
}
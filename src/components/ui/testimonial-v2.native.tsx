import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const portfolios = [
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=600&h=400",
];

export default function TestimonialV2() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}>
      <View style={styles.grid}>
        {portfolios.map((url, i) => (
          <Image 
            key={i} 
            source={{ uri: url }} 
            style={styles.image} 
            resizeMode="cover"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 20,
  },
  image: {
    width: width * 0.4,
    height: height * 0.3,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  }
});

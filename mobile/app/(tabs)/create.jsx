import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native'
import { useState } from 'react';
import { useRouter } from 'expo-router';
import styles from '../../assets/styles/create.styles';
import COLORS from "../../constants/colors";
import {Ionicons} from "@expo/vector-icons";

import * as ImagePicker from 'expo-image-picker';

import * as FileSystem from 'expo-file-system';

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBased64, setImageBased64] = useState(null); // To display the selected image 
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const pickImage = async () => {
    try {
      //request permission to access media library
      if (Platform.OS !== 'web'){
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }

      //launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        // you can also like this -> mediaTypes: ["images", "Videos"],
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, //lower quality for small base64
        base64: true, //get base64 string of the image
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        // if base64 is available, user it
        if(result.assets[0].base64) {
          setImageBased64(result.assets[0].base64);
        }else{
          //otherwise, convert the image to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setImageBased64(base64);
        }
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error picking image", "Threre was a problem selecting the image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    // Handle form submission logic here

  };

  //Rating Picker Component
  const renderRatingPicker = () => {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Ionicons 
            name={i <= rating ? "star" : "star-outline"} 
            size={24} 
            color={i <= rating ? "#f4b400" : COLORS.textSecondary} 
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
  }

  return (
    <KeyboardAvoidingView
      style = {{ flex: 1}}
      behavior = { Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={ styles.scrollView }>

        <View style={styles.card}>

          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>Share your favorite books with the community!</Text>
          </View>
          
          <View style={styles.form}>

            {/* book title */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Book title</Text>

                <View style={styles.inputContainer}>

                    {/* Icon on Left */}
                    <Ionicons 
                        name="book-outline"
                        size={20}
                        color={COLORS.textSecondary}
                        style={styles.inputIcon}
                    />
                    
                    {/* text input */}
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter book title"
                        placeholderTextColor={COLORS.placeholderText}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>
            </View>

            {/* rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>
            
            {/* image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Cover</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage}/>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={40} color={COLORS.textSecondary}/>
                    <Text style={styles.placeholderText}>Tap to select image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            {/* caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput 
                style={styles.textArea}
                placeholder="Write a short caption about the book ..."
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* submit button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <>
                      <Ionicons 
                        name="cloud-upload-outline" 
                        size={20} 
                        color={COLORS.white} 
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Share</Text>
                    </>
                  )
                }
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView, // TAMBAH INI
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {launchImageLibrary} from 'react-native-image-picker'; // TAMBAH INI
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddCollectionScreen = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState('Resume');
  const [fotoPreview, setFotoPreview] = useState(null); // TAMBAH INI

  const [judulMateri, setJudulMateri] = useState('');
  const [mataKuliah, setMataKuliah] = useState('');
  const [deskripsiResume, setDeskripsiResume] = useState('');
  const [semester, setSemester] = useState('0');
  const [harga, setHarga] = useState('');

  const [judulBuku, setJudulBuku] = useState('');
  const [penulis, setPenulis] = useState('');
  const [deskripsiBuku, setDeskripsiBuku] = useState('');

  // TAMBAH INI
  const labelKategori = [
    {label: 'Resume', value: 'Resume'},
    {label: 'Books', value: 'Book'},
  ];

  // TAMBAH INI
  const labelSemester = [
    {label: 'Pilih Semester', value: '0'},
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'},
    {label: '6', value: '6'},
    {label: '7', value: '7'},
    {label: '8', value: '8'},
  ];

  // TAMBAH INI
  const renderItemCategory = item => {
    const isSelected = item.value === selectedCategory;
    return (
      <View
        style={[
          styles.itemContainer,
          isSelected && styles.selectedItemContainer,
        ]}>
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item.label}
        </Text>
      </View>
    );
  };
  const renderItemSemester = item => {
    const isSelected = item.value === semester;
    return (
      <View
        style={[
          styles.itemContainer,
          isSelected && styles.selectedItemContainer,
        ]}>
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item.label}
        </Text>
      </View>
    );
  };

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0]?.uri; // Gunakan optional chaining
        if (uri) {
          setFotoPreview(uri);
        } else {
          Alert.alert('Error', 'Gambar tidak ditemukan');
        }
      }
    });
  };

  const handleUpload = async () => {
    const formData = new FormData();

    formData.append('types', selectedCategory.toLowerCase()); // Ganti 'category' dengan 'types'
    formData.append('price', harga);

    if (selectedCategory === 'Resume') {
      formData.append('title', judulMateri);
      formData.append('description', deskripsiResume);
      formData.append('semester', semester);
      formData.append('courseName', mataKuliah); // Tambahkan courseName
    } else if (selectedCategory === 'Book') {
      formData.append('title', judulBuku);
      formData.append('description', deskripsiBuku);
      formData.append('author', penulis); // Tambahkan jika diperlukan
    }

    if (fotoPreview) {
      formData.append('image', {
        uri: fotoPreview,
        name: `image_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
    }

    try {
      // Ambil userToken dari AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');

      if (!userToken) {
        Alert.alert('Error', 'Token tidak ditemukan, silakan login ulang!');
        return;
      }

      console.log('Uploading data:', formData);
      const response = await axios.post('https://backend-malle.vercel.app/api/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`, // Kirim userToken dalam header
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Data berhasil di-upload!');
        navigation.pop();
      } else {
        Alert.alert('Error', 'Upload tidak berhasil!');
      }
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.data);
      } else {
        console.error('Request Error:', error.message);
      }
      Alert.alert('Error', 'Gagal meng-upload data!');
    }
  };

  return (
    // GANTI SCROLLVIEW JADI INI
    <KeyboardAvoidingView
      behavior="height"
      style={[styles.container, {overflow: 'visible'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.iconHeader}>
          <Icon name="angle-left" size={25} color="#3E3E40" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tambah Koleksi</Text>
      </View>

      {/* TAMBAH SCROLLVIEW SEBELUM KATEGORI */}
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        {/* Kategori */}
        <View style={styles.dropdownContainer}>
          <Icon name="list" size={20} color="#000" style={styles.icon} />
          <Text style={styles.label}>
            Kategori <Text style={{color: 'red'}}>*</Text>
          </Text>

          {/* UBAH SEMUA KODE DROPDOWN JADI INI */}
          <Dropdown
            data={labelKategori}
            labelField="label"
            valueField="value"
            placeholder="Pilih Kategori"
            value={selectedCategory}
            onChange={item => setSelectedCategory(item.value)}
            style={styles.dropdown}
            selectedTextStyle={styles.dropdownText}
            placeholderStyle={styles.placeholderText}
            inputSearchStyle={styles.searchInput}
            iconStyle={styles.arrowIcon}
            renderItem={renderItemCategory}
          />
        </View>

        {/* UPDATE BAGAIN UPLOAD FOTO */}
        {/* Foto Preview */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Foto Preview <Text style={{color: 'red'}}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.photoUpload}
            onPress={handleSelectImage}>
            {fotoPreview ? (
              <Image source={{uri: fotoPreview}} style={styles.previewImage} />
            ) : (
              <Text style={styles.photoText}>+ Upload Foto</Text>
            )}
          </TouchableOpacity>
        </View>

        {selectedCategory === 'Resume' ? (
          // Jika kategori 'Resume' dipilih
          <>
            {/* Judul Materi */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Judul Materi <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Judul Materi"
                value={judulMateri}
                onChangeText={setJudulMateri}
              />
            </View>

            {/* Mata Kuliah */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Mata Kuliah <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Mata Kuliah"
                value={mataKuliah}
                onChangeText={setMataKuliah}
              />
            </View>

            {/* Deskripsi Resume */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Deskripsi Resume <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Deskripsi Resume"
                value={deskripsiResume}
                onChangeText={setDeskripsiResume}
              />
            </View>

            {/* Semester */}
            <View style={styles.dropdownContainer}>
              <Icon
                name="graduation-cap"
                size={20}
                color="#000"
                style={styles.icon}
              />
              <Text style={styles.label}>
                Semester <Text style={{color: 'red'}}>*</Text>
              </Text>

              {/* UBAH SEMUA KODE DROPDOWN JADI INI */}
              <Dropdown
                data={labelSemester}
                labelField="label"
                valueField="value"
                placeholder="Pilih Kategori"
                value={semester}
                onChange={item => setSemester(item.value)}
                style={styles.dropdown}
                selectedTextStyle={styles.dropdownText}
                placeholderStyle={styles.placeholderText}
                inputSearchStyle={styles.searchInput}
                iconStyle={styles.arrowIcon}
                renderItem={renderItemSemester}
              />
            </View>
          </>
        ) : (
          // Jika kategori 'Buku' dipilih
          <>
            {/* Judul Buku */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Judul Buku <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Judul Buku"
                value={judulBuku}
                onChangeText={setJudulBuku}
              />
            </View>

            {/* Penulis */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Nama Penulis <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Nama Penulis"
                value={penulis}
                onChangeText={setPenulis}
              />
            </View>

            {/* Deskripsi Buku */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Deskripsi Buku <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Nama Penerbit"
                value={deskripsiBuku}
                onChangeText={setDeskripsiBuku}
              />
            </View>
          </>
        )}

        {/* Harga */}
        <View style={styles.inputContainer}>
          <View style={styles.customRow}>
            <Icon name="tags" size={20} color="#000" style={styles.icon} />
            <Text style={styles.label}>
              Harga <Text style={{color: 'red'}}>*</Text>
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Masukkan Nominal"
            keyboardType="numeric"
            value={harga}
            onChangeText={setHarga}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={{color: '#000', fontSize: 16, fontWeight: 'bold'}}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
              Upload
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  header: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconHeader: {
    position: 'absolute',
    left: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    zIndex: 1000,
  },
  dropdown: {
    flex: 1,
    paddingHorizontal: 8, // TAMBAH INI
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
    marginRight: 8,
  },
    placeholderText: {
      fontSize: 14,
      color: '#000', // Pastikan teks placeholder berwarna hitam
    },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: '#000',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },

  // TAMBAH selectedItemContainer
  selectedItemContainer: {
    backgroundColor: '#87CEFA',
  },

  photoUpload: {
    borderWidth: 1,
    borderColor: '#87CEFA',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    borderStyle: 'dotted',
  },
  photoText: {
    fontSize: 16,
    color: '#87CEFA',
  },

  // TAMBAH previewImage
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 50,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 8,
    alignItems: 'center',
    elevation: 3,
  },
  uploadButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#00AEEF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00AEEF',
    marginLeft: 8,
    alignItems: 'center',
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
});

export default AddCollectionScreen;

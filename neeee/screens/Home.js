import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from '../database';
import Filters from '../components/Filters';
import { getSectionListData, useUpdateEffect } from '../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['starters', 'mains', 'desserts'];

const Item = React.memo(({ name, price, description, image }) => (
  <View style={styles.item}>
    <View style={styles.itemBody}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <Image style={styles.itemImage} source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true` }} />
  </View>
));

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(sections.map(() => false));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const menu = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category
      }));
      return menu;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          await saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);

        const storedProfile = await AsyncStorage.getItem('profile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (e) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => !filterSelections.every((item) => item === false) ? filterSelections[i] : true);
      try {
        const menuItems = await filterByQueryAndCategories(query, activeCategories);
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert('Error', e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => setQuery(q), []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = (index) => {
    const newFilterSelections = [...filterSelections];
    newFilterSelections[index] = !filterSelections[index];
    setFilterSelections(newFilterSelections);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#495e57" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>An error occurred: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../img/littleLemonLogo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
        <Pressable style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {profile.firstName ? profile.firstName[0] : ''}
                {profile.lastName ? profile.lastName[0] : ''}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.heroSection}>
        <Text style={styles.heroHeader}>Little Lemon</Text>
        <View style={styles.heroBody}>
          <View style={styles.heroContent}>
            <Text style={styles.heroHeader2}>Chicago</Text>
            <Text style={styles.heroText}>
              We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../img/restauranfood.png")}
            accessible={true}
            accessibilityLabel={"Little Lemon Food"}
          />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor="#333333"
          inputStyle={{ color: '#333333' }}
          elevation={0}
        />
      </View>
      <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      {data.length ? (
        <SectionList
          style={styles.sectionList}
          sections={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item name={item.name} price={item.price} description={item.description} image={item.image} />
          )}
          renderSectionHeader={({ section: { name } }) => (
            <Text style={styles.itemHeader}>{name}</Text>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No items found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#dee3e9",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: '#e4e4e4',
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: '#495e57',
    backgroundColor: '#fff'
  },
  name: {
    fontSize: 20,
    color: '#000000',
    paddingBottom: 5,
  },
  description: {
    color: '#495e57',
    paddingRight: 5,
  },
  price: {
    fontSize: 20,
    color: '#495e57',
    paddingTop: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  avatar: {
    flex: 1,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarEmpty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0b9a6a',
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    color: '#fff',
    fontSize: 20,
  },
  heroSection: {
    backgroundColor: '#495e57',
    padding: 15,
  },
  heroHeader: {
    color: '#f4ce14',
    fontWeight: 'bold',
    fontSize: 36,
  },
  heroHeader2: {
    color: '#fff',
    fontSize: 24,
  },
  heroText: {
    color: '#fff'
  },
  heroBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroContent: {
    flex: 1,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  delivery: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#495e57',
  },
});

export default Home;

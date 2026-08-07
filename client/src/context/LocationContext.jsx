import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const LocationContext = createContext();

// Indian States, Districts & Talukas Database
export const INDIA_LOCATION_DATA = {
  Maharashtra: {
    Nagpur: ['Nagpur Rural', 'Hingna', 'Kamptee', 'Umred', 'Saoner', 'Katol', 'Narkhed', 'Ramtek', 'Parseoni', 'Kuhi', 'Bhiwapur', 'Kalameshwar'],
    Wardha: ['Wardha', 'Seloo', 'Arvi', 'Ashti', 'Karanja', 'Deoli', 'Hinganghat', 'Samudrapur'],
    Amravati: ['Amravati', 'Bhatkuli', 'Nandgaon Khandeshwar', 'Chandur Railway', 'Dhamangaon Railway', 'Morshi', 'Warud', 'Achalpur', 'Chandurbazar', 'Anjangaon Surji', 'Daryapur'],
    Yavatmal: ['Yavatmal', 'Kalamb', 'Babulgaon', 'Darwha', 'Digras', 'Arni', 'Pusad', 'Umarkhed', 'Mahagaon', 'Ghatanji', 'Wani', 'Maregaon', 'Zari Jamani', 'Kelapur'],
    Chandrapur: ['Chandrapur', 'Bhadravati', 'Warora', 'Chimur', 'Nagbhid', 'Bramhapuri', 'Sindewahi', 'Mul', 'Gondpipri', 'Rajura', 'Korpana', 'Jiwati', 'Ballarpur'],
    Nashik: ['Nashik', 'Igatpuri', 'Dindori', 'Peth', 'Trimbakeshwar', 'Kalwan', 'Deola', 'Surgana', 'Baglan', 'Malegaon', 'Nandgaon', 'Chandwad', 'Sinnar', 'Yeola', 'Niphad'],
    Pune: ['Pune City', 'Haveli', 'Khed', 'Ambegaon', 'Junnar', 'Shirur', 'Daund', 'Indapur', 'Baramati', 'Purandar', 'Bhor', 'Velhe', 'Mulshi', 'Maval'],
    'Chhatrapati Sambhajinagar': ['Aurangabad', 'Kannad', 'Soegaon', 'Sillod', 'Phulambri', 'Khuldabad', 'Vaijapur', 'Gangapur', 'Paithan'],
    Kolhapur: ['Karveer', 'Panhala', 'Shahuwadi', 'Kagal', 'Hatkanangle', 'Shirol', 'Radhanagari', 'Gargoti', 'Bhudaragad', 'Ajara', 'Chandgad', 'Gadhinglaj'],
    Nanded: ['Nanded', 'Mudkhed', 'Ardhapur', 'Bhokar', 'Umri', 'Loha', 'Kandhar', 'Kinwat', 'Mahoor', 'Hadgaon', 'Himayatnagar', 'Degloor', 'Mukhed', 'Dharmabad', 'Naigaon', 'Biloli'],
  },
  'Madhya Pradesh': {
    Chhindwara: ['Chhindwara', 'Tamia', 'Parasia', 'Junnardeo', 'Amarwara', 'Chaurai', 'Sausar', 'Pandhurna', 'Bichhua', 'Harrai', 'Mohkhed'],
    Seoni: ['Seoni', 'Bhoma', 'Chhapara', 'Lakhnadon', 'Ghansaur', 'Keolari', 'Barghat', 'Kurai'],
    Indore: ['Indore', 'Mhow', 'Depalpur', 'Sanwer'],
    Bhopal: ['Bhopal', 'Huzur', 'Berasia'],
    Ujjain: ['Ujjain', 'Nagda', 'Khachrod', 'Mahidpur', 'Tarana', 'Ghatiya', 'Barnagar'],
    Gwalior: ['Gwalior', 'Bhitarwar', 'Dabra'],
    Jabalpur: ['Jabalpur', 'Sihora', 'Patan', 'Kundam'],
  },
  'Uttar Pradesh': {
    Varanasi: ['Varanasi', 'Pindra', 'Kashi', 'Raja Talab'],
    Lucknow: ['Lucknow', 'Bakshi Ka Talab', 'Malihabad', 'Mohanlalganj', 'Sarojini Nagar'],
    Agra: ['Agra', 'Etmadpur', 'Kiraoli', 'Kheragarh', 'Fatehabad', 'Bah'],
    Kanpur: ['Kanpur Sadar', 'Ghatampur', 'Bilhaur'],
    Gorakhpur: ['Gorakhpur', 'Sahjanwa', 'Chauri Chaura', 'Bansgaon', 'Khajni', 'Gola', 'Campierganj'],
  },
  Punjab: {
    Ludhiana: ['Ludhiana East', 'Ludhiana West', 'Jagraon', 'Samrala', 'Khanna', 'Payal', 'Raikot'],
    Amritsar: ['Amritsar I', 'Amritsar II', 'Ajnala', 'Baba Bakala'],
    Jalandhar: ['Jalandhar I', 'Jalandhar II', 'Nakodar', 'Phillaur', 'Shahkot'],
    Patiala: ['Patiala', 'Nabha', 'Rajpura', 'Samana', 'Patran'],
  },
  Gujarat: {
    Ahmedabad: ['Ahmedabad', 'Daskroi', 'Sanand', 'Bavla', 'Dholka', 'Viramgam', 'Mandal', 'Detroj-Rampura', 'Dhandhuka'],
    Rajkot: ['Rajkot', 'Kotda Sangani', 'Jasdan', 'Gondal', 'Lodhika', 'Paddhari', 'Morbi', 'Wankaner'],
    Surat: ['Choryasi', 'Olpad', 'Kamrej', 'Mandvi', 'Mangrol', 'Umarpada', 'Bardoli', 'Mahuva', 'Palsana'],
    Vadodara: ['Vadodara', 'Padra', 'Karjan', 'Dabhoi', 'Waghodia', 'Savli'],
  },
  Rajasthan: {
    Jaipur: ['Jaipur', 'Amber', 'Sanganer', 'Chaksu', 'Phulera', 'Shahpura', 'Kotputli', 'Jamwa Ramgarh', 'Basa'],
    Jodhpur: ['Jodhpur', 'Luni', 'Bilara', 'Osian', 'Phalodi', 'Shergarh', 'Balesar'],
    Udaipur: ['Girwa', 'Kherwara', 'Mawal', 'Salumbar', 'Sarada', 'Jhadol', 'Gogunda', 'Kotra'],
  },
  Karnataka: {
    Bengaluru: ['Bengaluru North', 'Bengaluru South', 'Bengaluru East', 'Anekal'],
    Mysuru: ['Mysuru', 'Nanjangud', 'T. Narasipura', 'Hunsur', 'Periyapatna', 'K.R. Nagar', 'H.D. Kote'],
    Belagavi: ['Belagavi', 'Chikkodi', 'Gokak', 'Athani', 'Raybag', 'Hukkeri', 'Khanapur', 'Ramdurg', 'Saundatti'],
  },
  Telangana: {
    Warangal: ['Warangal', 'Khana Pur', 'Narsampet', 'Ghenpur', 'Duggondi'],
    Karimnagar: ['Karimnagar', 'Manakondur', 'Huzurabad', 'Jammikunta'],
    Nalgonda: ['Nalgonda', 'Miryalaguda', 'Devarakonda', 'Nagarjuna Sagar'],
  },
};

const DEFAULT_LOCATION = {
  state: 'Maharashtra',
  district: 'Nagpur',
  taluka: 'Hingna',
  village: 'Sukli',
  latitude: 21.1458,
  longitude: 79.0882,
  isGps: false,
  updatedAt: new Date().toISOString(),
};

export const LocationProvider = ({ children }) => {
  const [locationProfile, setLocationProfile] = useState(() => {
    const saved = localStorage.getItem('krishi_location_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_LOCATION; }
    }
    return DEFAULT_LOCATION;
  });

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveLocation = (newLoc) => {
    const updated = {
      ...locationProfile,
      ...newLoc,
      updatedAt: new Date().toISOString(),
    };
    setLocationProfile(updated);
    localStorage.setItem('krishi_location_profile', JSON.stringify(updated));

    // Async sync with profile backend
    API.put('/auth/profile', {
      state: updated.state,
      district: updated.district,
      taluka: updated.taluka,
      village: updated.village,
      latitude: updated.latitude,
      longitude: updated.longitude,
    }).catch((e) => console.log('Location sync info:', e?.message));
  };

  // Automatic GPS Geolocation Detection
  const detectGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          // Reverse Geocode using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
            { headers: { 'User-Agent': 'KrishiSeva-AI/1.0' } }
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address || {};

            const state = address.state || address.region || 'Maharashtra';
            const district = (address.state_district || address.county || address.city || 'Nagpur').replace(' District', '');
            const taluka = address.subdistrict || address.taluk || address.tehsil || address.town || 'Hingna';
            const village = address.village || address.suburb || address.hamlet || address.neighbourhood || 'Sukli';

            saveLocation({
              state,
              district,
              taluka,
              village,
              latitude: Number(latitude.toFixed(4)),
              longitude: Number(longitude.toFixed(4)),
              accuracy: Math.round(accuracy),
              isGps: true,
            });
            setGpsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Reverse geocode API warning, fallback to GPS coords:', err);
        }

        // Fallback if reverse geocoding API is offline/blocked
        saveLocation({
          latitude: Number(latitude.toFixed(4)),
          longitude: Number(longitude.toFixed(4)),
          accuracy: Math.round(accuracy),
          isGps: true,
        });
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError('GPS Permission denied. Please select your location manually below.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError('Location information is unavailable. Please choose manually.');
            break;
          case error.TIMEOUT:
            setGpsError('GPS Request timed out. Please try manual location selection.');
            break;
          default:
            setGpsError('An unknown error occurred while retrieving GPS location.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  return (
    <LocationContext.Provider
      value={{
        locationProfile,
        saveLocation,
        detectGpsLocation,
        gpsLoading,
        gpsError,
        isModalOpen,
        openLocationModal: () => setIsModalOpen(true),
        closeLocationModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationProfile = () => useContext(LocationContext);

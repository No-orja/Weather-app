import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ar'; // تحميل اللغة العربية لـ moment
import 'moment/locale/en-gb'; // تحميل اللغة الإنجليزية لـ moment
import { useTranslation } from 'react-i18next';
import '@fontsource/roboto'; // خط إنجليزي
import '@fontsource/cairo';  // خط عربي

const key = "1814b5431d82d4c2b5e99008b875e6a7";
const lat = "40.6013";
const lon = "33.6134";
let cancelAxios = null;

export default function BasicCard() {
  const { t, i18n } = useTranslation();
  
  const [temp, setTemp] = useState({
    min: null,
    max: null,
    number: null,
    description: "",
    name:"",
    icon: null
  });
  const [local, setLocal] = useState("en");
  const [dateState, setDateState] = useState(moment().format('MMMM Do YYYY')); 
  const [time, setTime] = useState(moment().format('LTS'));
  const [error, setError] = useState(null); // إدارة الأخطاء

  let direction = local === "ar" ? "rtl" : "ltr"; 
  
  function handleLangClicked() {
    const newLang = local === "ar" ? "en" : "ar";
    setLocal(newLang);
    i18n.changeLanguage(newLang);
    moment.locale(newLang);
    setDateState(moment().format('MMMM Do YYYY'));
  }

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`, {
      cancelToken: new axios.CancelToken((c) => {
        cancelAxios = c;
      })
    })
    .then(function (response) {
      const min = response.data.main.temp_min;
      const max = response.data.main.temp_max;
      const name = response.data.name;
      const description = response.data.weather[0].description;
      const responseIcon = response.data.weather[0].icon;
      const responseTemp = Math.round(response.data.main.temp - 272.15);
      setTemp({
        number: responseTemp, 
        min, 
        max, 
        description, 
        name,
        icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
      });
    })
    .catch(function (error) {
      setError("Failed to fetch weather data. Please try again later."); // عرض رسالة خطأ
      console.error(error);
    });
    return () => {
      if (cancelAxios) cancelAxios();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().format('LTS'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setDateState(moment().format('MMMM Do YYYY'));
    setTime(moment().format('LTS'));
  }, [local]);

  return (
    <Card sx={{ minWidth: 275, backgroundColor: '#f0f8ff', borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }} >
      <CardContent dir={direction} sx={{ fontFamily: local === 'ar' ? 'Cairo, sans-serif' : 'Roboto, sans-serif' }}>
        {/* Header */}
        <Grid container spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00796b' }}>
              {t(temp.name)}
            </Typography>
          </Grid>
          <Grid item xs={8} sx={{ textAlign: local === "ar" ? "left" : "right" }}>
            <Typography dir={direction} variant="subtitle1" sx={{ color: '#555', fontFamily: local === 'ar' ? 'Cairo, sans-serif' : 'Roboto, sans-serif' }}>
              {t(dateState)}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#777', fontFamily: local === 'ar' ? 'Cairo, sans-serif' : 'Roboto, sans-serif' }}>
              {time}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Weather Info */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#00796b' }}>
              {temp.number}°C
            </Typography>
            <Typography variant="h6" sx={{ color: '#888' }}>
              {t(temp.description)}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#555' }}>
              {t("Max")}: {temp.max}°C | {t("Min")}: {temp.min}°C
            </Typography>
            <Button 
              onClick={handleLangClicked}
              variant="contained" 
              sx={{ mt: 2, backgroundColor: '#ff5722', color: '#fff', '&:hover': { backgroundColor: '#e64a19' } }}
            >
              {local === 'en' ? "العربية" : "English"} 
            </Button>
          </Grid>
          
          <Grid item xs={6}>
            <Box
              component="img"
              src={temp.icon}
              sx={{
                height: '200px',
                width: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: 2,
                background: "#76d0f9"
                
              }}
            />
          </Grid>
        </Grid>

        {/* Error Snackbar */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

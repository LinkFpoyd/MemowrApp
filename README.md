MEMOWRAPP

Projektin tulos on muistiinpanosovellus nimeltä MemowrApp. Sovellus sisältää kaksi pääasiallista toimintoa: nauhoittimen ja muistiinpanolistan. 
Siirtyminen eri toiminnallisuuksien välillä on toteutettu BottomTabNavigator-komponentilla. 

NAUHOITIN

Tämän osion nauhoitustoiminnallisuus on toteutettu Expon AV-komponentilla. Nauhoitin itsessään luo Audio.Recording luokan tallenteen.
Nauhoitetusta äänitteestä viedään SQLite-tietokantaan äänitteen otsikko, kesto, viittaus tiedostosijaintiin, sekä luontipäivämäärä.
Näiden viitteiden vienti tietokantaan mahdollistaa äänitteiden tarkastelun ja toiston myös senkin jälkeen kun sovellus on suljettu ja käynnistetty uudelleen. 

Nauhoitetut äänitteet esitellään FlatList-komponentissa. Flatlistin esittämät nauhoitteet on tämän lisäksi kääritty React Native Elements-kirjaston
Card-komponenttiin. Cardin otsikossa näytetään äänitteen otsikko ja luontipäivämäärä, ja itse bodyssa nauhoitteen kesto sekä napit jotka toteuttavat 
toisto- ja poistotoiminnallisuudet. Toistopainike vie playSound funktiolle tallenteen tiedostosijainnin, jonka kautta funktio valmistelee toisto-objektin
ja toistaa sen playAsync-funktiolla.

MUISTIINPANOT

Tässä osiossa käyttäjä voi lisätä tekstimuotoisia muistiinpanoja listaan. Käyttäjän painaessa 'Lisää muistiinpano' nappia, avautuu Modal-komponentti,
jonka sisään käyttäjä voi syöttää muistiinpanon otsikon ja runkotekstin. Päivämäärä ja aika lisätään automaattisesti luontihetken mukaan. Luodut muistiinpanot
esitellään FlatListissa React Native Elements-kirjaston Card-komponenttien sisällä. Käyttäjä voi poistaa tarpeettomat muistiinpanot Poista-napista.
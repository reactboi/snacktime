## Hope you like spaghetti
We're pasta point were it's not spaghetti

## Start
```
npm run start
```

## Struktur
Alle tekstfilene som brukes som pseudo-DB bruker "|" som separasjonsstreng.

### /public/listIndex.txt 

Viser oversikt over aktive lister, den er på formatet 

[Navn på listen] | [Startdato for listen] | [Ukedagnummer] | [Mappenavn]

```
D&D|2020-01-01|2|dnd
Mario Kart|2019-03-01|3|mkultra
```
Første vil gi overskriften "D&D", telle fra 1.1.2020, ha tirsdag som standarddag, og hente konfigurasjon fra mappen /public/dnd/ 

Andre vil gi overskriften "Mario Kart", telle fra 1.3.2019, ha onsdag som standarddag, og hente konfigurasjon fra mappen /public/mkultra/ 

### /public/[mappenavn]

Disse mappene er de som refereres til med "Mappenavn" over. De inneholder alle 3 filer. 

#### columns.txt

Denne inneholder overskriften på hver kolonne i listen, samt muligens ikonnavn som skal brukes. Vi kan ha et vilkårlig antall kolonner.

Om custom ikoner skal brukes, skal de legges i /public/images mappen. Alle som ikke får et standardikon bruker "default.svg".

```
Snacks|snacks.png
Brus|brus.png
Mat
```

#### players.txt

Denne inneholder liste over spillerne, samt datoen de startet, samt mulig sluttdato. Sluttdato er valgfri. Om noen midlertidig går ut av spillet, skal de settes inn med sluttdato og settes inn på nytt når de starter opp igjen (de kan settes inn på samme posisjon). ALDRI fjern en rad om ikke sluttdato er under datoen kalenderen startet på. Hvis noen ønsker å fjerne sporene sine helt, kan navn endres på raden(e) deres.

```
Fred|2020-01-01
Frank|2020-01-01|2021-01-01
Frank|2021-02-01
Ronny|2020-02-01
```

#### extras.txt

Denne brukes ikke til å skippe eller legge til ekstra dager. Format Dato|[skip eller extra]
```
2021-01-10|skip
2021-01-12|extra
```
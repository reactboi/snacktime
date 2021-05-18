## Hope you like spaghetti
We're pasta point were it's not spaghetti

## Start
npm run start

## Struktur
Alle tekstfilene som brukes som pseudo-DB bruker "|" som separasjonsstreng

### /public/listIndex.txt 

Viser oversikt over aktive lister, den er på formatet 

[Navn på listen] | [Startdato for listen] | [Ukedagnummer] | [Mappenavn]

### /public/[mappenavn]

Disse mappene er de som refereres til med "Mappenavn" over. De inneholder alle 3 filer. 

#### columns.txt

Denne inneholder overskriften (og alt-tekst) på hver kolonne i listen. 

#### players.txt

Denne inneholder liste over spillerne, samt datoen de startet, samt mulig sluttdato. 

#### extras.txt

Denne brukes ikke til noe. Ideelt skal man kunne skippe dager, eller legge til ekstra her, men the spaghetti will not permit. 
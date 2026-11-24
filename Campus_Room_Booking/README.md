# Campus du Parc — API de réservation de salles

Ce dossier contient l'application campus. Le TD Healthcare reste dans `Full_DevOps_Lab`.

## Démarrer

Avec Node.js 24, depuis `Campus_Room_Booking` :

```sh
npm ci
npm run lint
npm test -- --coverage
npm run dev
```

Le serveur écoute sur `http://localhost:43187`. La variable `PORT` permet de changer de port.

## Buildings

| Méthode | Adresse | Résultat |
| --- | --- | --- |
| GET | `/api/buildings` | 200 et la liste des bâtiments |
| POST | `/api/buildings` | 201 et le bâtiment créé |

Au démarrage, le campus contient les bâtiments A (id 1), B (id 2) et C (id 3).

Exemple de corps JSON pour un POST :

```json
{ "name": "D" }
```

Le nom est obligatoire, doit être une chaîne non vide et est enregistré en majuscules sans espaces aux extrémités. Un nom absent ou invalide renvoie 400 ; un nom existant renvoie 409, même avec une casse différente. Le serveur attribue l'identifiant et impose `Campus du Parc` comme campus.

Les données sont conservées en mémoire : les ajouts disparaissent au redémarrage. D est seulement un exemple pour tester la création ; A, B et C sont les bâtiments initiaux.

## Organisation et intégration avec Rooms

- `src/app.js` configure Express et charge automatiquement les fichiers `src/routes/*.route.js`, dont Rooms et Buildings.
- `src/index.js` lance le serveur.
- `src/data/buildings.js` exporte les données partagées.
- `src/routes/buildings.route.js` traite les GET et POST.
- `test/buildings.test.js` vérifie lecture, création, validation et doublons.

Pour relier une salle à un bâtiment, l'API Rooms peut importer `buildings` depuis le module de données et vérifier son `buildingId`. Ne pas créer une seconde copie du tableau dans Rooms. Rooms utilise actuellement un champ texte `building` ; la liaison par identifiant reste à intégrer avec le groupe.

## Postman

Importer `postman/Buildings.postman_collection.json` dans Postman. La variable de collection `baseUrl` vaut `http://localhost:43187`.

La collection comprend GET, POST valide, POST sans nom et POST en doublon. Le POST valide utilise un nom de test unique à chaque exécution pour permettre de relancer la collection sans redémarrer le serveur. Ces exécutions ajoutent des bâtiments de test en mémoire.

## CI

Le workflow `.github/workflows/campus-ci.yml` installe les dépendances, lance le lint et les tests avec couverture, puis publie le rapport. Le seuil est de 80 % pour les lignes, instructions, fonctions et branches. Le workflow historique du TD reste indépendant.

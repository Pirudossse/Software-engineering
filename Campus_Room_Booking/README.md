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
| PUT | `/api/buildings/:id` | 200 et le bâtiment modifié |
| DELETE | `/api/buildings/:id` | 204 sans corps de réponse |

Au démarrage, le campus contient les bâtiments A (id 1), B (id 2) et C (id 3).

Exemple de corps JSON pour un POST ou PUT :

```json
{ "name": "D" }
```

Le nom est obligatoire, doit être une chaîne non vide et est enregistré en majuscules sans espaces aux extrémités. Un nom absent ou invalide renvoie 400 ; un nom existant renvoie 409, même avec une casse différente. Le serveur attribue l'identifiant et impose `Campus du Parc` comme campus.

PUT modifie le nom et conserve l'identifiant et le campus. PUT et DELETE renvoient 404 si le bâtiment n'existe pas. DELETE ne demande aucun corps JSON. Les validations 400 et 409 s'appliquent aussi à PUT.

Les données sont conservées en mémoire : ajouts, modifications et suppressions disparaissent au redémarrage. D est seulement un exemple pour tester la création ; A, B et C sont les bâtiments initiaux.

## Organisation et intégration avec Rooms

- `src/app.js` configure Express et charge automatiquement les fichiers `src/routes/*.route.js`, dont Rooms et Buildings.
- `src/index.js` lance le serveur.
- `src/data/buildings.js` exporte les données partagées.
- `src/routes/buildings.route.js` traite les GET, POST, PUT et DELETE.
- `test/buildings.test.js` vérifie lecture, création, modification, suppression, validation, doublons et identifiants inconnus.

Pour relier une salle à un bâtiment, l'API Rooms peut importer `buildings` depuis le module de données et vérifier son `buildingId`. Ne pas créer une seconde copie du tableau dans Rooms. Rooms utilise actuellement un champ texte `building` ; la liaison par identifiant reste à intégrer avec le groupe.

## Postman

Importer `postman/Buildings.postman_collection.json` dans Postman. La variable de collection `baseUrl` vaut `http://localhost:43187`.

Exécuter la collection dans l'ordre : GET, POST valide, POST sans nom, POST en doublon, PUT, DELETE, puis DELETE du même identifiant (404). Le POST utilise un nom unique et mémorise l'identifiant créé. PUT modifie ce bâtiment de test et DELETE le supprime ; les bâtiments initiaux sont conservés.

## CI

Le workflow `.github/workflows/campus-ci.yml` installe les dépendances, lance le lint et les tests avec couverture, puis publie le rapport. Le seuil est de 80 % pour les lignes, instructions, fonctions et branches. Le workflow historique du TD reste indépendant.

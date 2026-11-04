# Lab 5 — JavaScript et API Healthcare

Dépôt : https://github.com/Pirudossse/Software-engineering

## 1. Objectif et continuité avec le Lab 4

Ce travail reprend le projet Node.js/Express du Lab 4 et sa chaîne d'intégration continue. Le Lab 5 ajoute un contexte hospitalier : consulter et ajouter des médecins et des patients, programmer des rendez-vous et consulter des métriques. Les routes techniques du Lab 4 (`/health`, `/info`, `/version`) restent disponibles.

Le compte rendu présente les exercices JavaScript de la partie 2, les API développées, les collections Postman et la validation par les tests automatiques.

## 2. Partie 2 — Pratique JavaScript

Les exercices sont dans `Full_DevOps_Lab/js-practice.js`, `hospitalData.js` et `main.js`.

| Exercice | Réalisation et apprentissage |
| --- | --- |
| 2.1 — Variables et conditions | Nom de l'hôpital, nombre de médecins et état d'ouverture ; utilisation de `const`, `let`, des chaînes interpolées et de `if/else`. |
| 2.2 — Tableaux et fonctions | Parcours et numérotation des médecins, ajout avec `push`, comptage avec `length`, recherche avec `includes`. |
| 2.3 — Objets imbriqués | Patient avec âge, maladies et médecin ; accès aux propriétés imbriquées et ajout d'une maladie. |
| 2.4 — Manipulation de données | Filtrage des patients de plus de 30 ans avec `filter`, ajout d'un patient avec un identifiant et affichage du tableau. |
| 2.5 — Modules | Export du tableau de médecins et de `addDoctor` depuis `hospitalData.js`, puis import et utilisation dans `main.js`. |
| 2.6 — Gestion des erreurs | Création d'un rendez-vous ; levée d'une erreur si un champ manque et traitement avec `try/catch`. |
| 2.7 — Asynchronisme | Simulation du chargement des données avec une `Promise` et `setTimeout`, puis récupération avec `async/await`. |

Depuis `Full_DevOps_Lab`, exécuter :

```sh
node js-practice.js
node main.js
```

Les sorties permettent de vérifier le comportement des exercices. Les captures individuelles de leur exécution sont à joindre au rendu selon les consignes de l'enseignante.

## 3. Partie 3 — API hospitalières

Le serveur écoute par défaut sur `http://localhost:3000`. Express lit les corps JSON grâce à `express.json()`. Les fichiers `src/routes/auto/*.route.js` sont chargés automatiquement par `src/app.js`. Le gestionnaire global d'erreurs est enregistré après les routes.

| Méthode | Route | Fonction et réponse |
| --- | --- | --- |
| GET | `/api/doctors` | Liste des médecins ; statut 200. |
| POST | `/api/doctors` | Ajout avec `name` et `specialty` ; statut 201 et identifiant. Champ obligatoire absent : 400. |
| GET | `/api/patients` | Liste des patients ; statut 200. |
| POST | `/api/patients` | Ajout avec `name` et `age` ; statut 201 et identifiant. Champ manquant ou âge autre qu'un entier positif ou nul : 400. |
| POST | `/api/appointments` | Création avec `doctor`, `patient`, `date` ; statut 201 et identifiant. Champs manquants, vides ou non textuels, ou date non interprétable : 400. |
| GET | `/api/metrics` | Statut 200 avec `uptime` (secondes), `memoryUsage` (RSS en octets), `doctorsCount`, `patientsCount`, `appointmentsCount`. |

### Exemple : création d'un rendez-vous

Ticket Jira : **DEVOPS-20 — Appointments API — create appointments**.

Requête `POST http://localhost:3000/api/appointments`, avec `Content-Type: application/json` :

```json
{
  "doctor": "Dr. Lee",
  "patient": "Alice",
  "date": "2026-11-10T14:00:00Z"
}
```

Exemple de réponse **201 Created** sur un serveur venant de démarrer :

```json
{
  "id": 1,
  "doctor": "Dr. Lee",
  "patient": "Alice",
  "date": "2026-11-10T14:00:00Z"
}
```

Un champ manquant ou vide produit `{"error":"Doctor, patient and date are required"}` avec le statut 400. Une date non interprétable produit `{"error":"Invalid date"}` avec le statut 400.

Les données sont conservées dans des tableaux en mémoire : elles sont réinitialisées au redémarrage. Les rendez-vous contiennent des noms textuels ; le code ne vérifie pas l'existence du médecin ou du patient, ni les conflits de créneaux. Les compteurs de `/api/metrics` lisent directement ces tableaux.

### Routes techniques conservées

`GET /` renvoie un message d'accueil ; `GET /health` renvoie `OK` ; `GET /info` décrit l'application et son environnement ; `GET /version` renvoie la version du projet. `GET /boom` sert à tester le gestionnaire d'erreurs et est désactivée en production.

## 4. Partie 4 — Vérification avec Postman

Les collections au format Postman v2.1 sont dans le dossier `postman/` à la racine.

| Fichier | Requêtes et assertions présentes |
| --- | --- |
| `Healthcare API Postman Collection.json` | Médecins : GET (200 et tableau), création (201 et identifiant), champ manquant (400). |
| `Patients.postman_collection.json` | Patients : GET (200 et structure), création (201 et données), champ manquant et âge invalide (400). |
| `Appointments.postman_collection.json` | Rendez-vous valide : statut 201, identifiant numérique et vérification des données renvoyées. |
| `Metrics.postman_collection.json` | Métriques : statut 200, types et valeurs des mesures et des trois compteurs. |

Pour reproduire la vérification :

1. Démarrer le serveur avec `npm run dev` dans `Full_DevOps_Lab`.
2. Dans Postman, importer les quatre fichiers du dossier `postman/`.
3. Pour la collection Metrics, définir la variable `baseUrl` à `http://localhost:3000` dans la collection ou l'environnement actif. La collection Patients possède déjà cette valeur ; les deux autres utilisent une URL locale explicite.
4. Pour les POST, utiliser `Body → raw → JSON`.
5. Envoyer les requêtes et consulter `Test Results`, ou lancer chaque collection avec le Runner.

Pour la création d'un rendez-vous, la vérification manuelle effectuée a renvoyé **201 Created** et les deux assertions Postman ont été marquées **passed** : statut 201 et conformité des données. Les cas d'erreur de cette route sont couverts par les tests Vitest. Les collections décrites ci-dessus sont fournies pour reproduire les vérifications ; leur présence seule ne constitue pas un rapport d'exécution de toutes les collections.

## 5. Tests automatiques et CI

Vitest et Supertest vérifient les routes ainsi que les fonctions utilitaires. Les tests de rendez-vous couvrent la création valide, les champs manquants, un champ vide et une date invalide.

Résultat de l'exécution GitHub Actions fournie pour le commit `88f9866` sur `main`, après fusion de la pull request #23 : **succès, 11 fichiers de tests et 45 tests réussis**.

| Mesure globale | Couverture |
| --- | ---: |
| Instructions | 95,74 % |
| Branches | 84,78 % |
| Fonctions | 88,88 % |
| Lignes | 96,47 % |

Le dossier `src/routes/auto` atteint 100 % de couverture des lignes. Les seuils dans `vitest.config.js` sont 80 % pour les lignes, fonctions et instructions, et 70 % pour les branches ; ils sont dépassés.

Le workflow `.github/workflows/ci.yml` s'exécute pour les pull requests vers `main` et les push sur `main`. Il utilise Node.js 20 et réalise :

```sh
npm ci
npm run lint
npm test -- --coverage
```

Le rapport de couverture est publié dans l'artefact `coverage-report`. Ces résultats correspondent à l'exécution CI fournie et ne prétendent pas mesurer une nouvelle exécution après modification de ce README.

## 6. Organisation du travail

Les contributions sont développées sur des branches, associées aux tickets Jira, puis proposées en pull requests. Les conflits sont résolus et la CI doit réussir avant la fusion. Pour DEVOPS-20, la branche `feature/DEVOPS-20-appointments-route` a apporté la route de rendez-vous, ses tests et sa collection Postman via la pull request #20. Le conflit sur `express.json()` a été résolu en conservant une seule déclaration globale.

## 7. Installation et exécution

Depuis la racine du dépôt :

```sh
cd Full_DevOps_Lab
npm ci
npm run lint
npm test -- --coverage
npm start
```

Sous Windows PowerShell, utiliser `npm.cmd` à la place de `npm` si nécessaire. `npm run dev` permet aussi de démarrer le serveur avec rechargement automatique.

## 8. Contenu du rendu

Le dépôt contient le code source, les exercices JavaScript, les tests, le workflow CI, les collections Postman et ce compte rendu. Le fichier historique `Full_DevOps_Lab.zip` présent dans le dépôt est une ancienne archive ; le code courant est dans le dossier `Full_DevOps_Lab/`.

Pour le dépôt DVL, fournir l'archive de la version finale du repository et ajouter en commentaire : https://github.com/Pirudossse/Software-engineering . Joindre également les captures demandées par l'enseignante.

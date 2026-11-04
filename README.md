# Lab 5 — Compte rendu

Nous avons repris le projet du Lab 4 pour y ajouter les routes de l’API hospitalière demandées dans le Lab 5. Nous avons conservé les routes existantes et le workflow GitHub Actions, puis intégré nos développements dans la branche `main`.

Dépôt : https://github.com/Pirudossse/Software-engineering

## Répartition du travail

La partie JavaScript a été réalisée individuellement. Pour la partie API, nous nous sommes réparti le travail de la manière suivante :

| Membre | Partie réalisée |
| --- | --- |
| Badis | Rendez-vous — `/api/appointments` |
| Oussama | Médecins — `/api/doctors` |
| Eliott | Métriques — `/api/metrics` |
| Alban | Patients — `/api/patients` |

## Partie 2 — Exercices JavaScript

Nous avons réalisé les exercices autour des données de l’hôpital : affichage de son état d’ouverture, parcours et recherche dans une liste de médecins, manipulation d’un objet patient et ajout d’une maladie. Nous avons également filtré les patients selon leur âge et ajouté un patient à la liste.

La séparation du code en modules a été faite dans `hospitalData.js` et `main.js`, avec l’export puis l’import de la liste des médecins et de la fonction `addDoctor`.

Pour les rendez-vous, nous avons utilisé une fonction qui renvoie les informations du rendez-vous lorsque les champs sont renseignés et déclenche une erreur lorsqu’un champ manque. Cette erreur est récupérée avec `try/catch`. Enfin, nous avons simulé un chargement de données avec une promesse, puis utilisé `async/await` pour attendre le résultat.

Les exercices sont regroupés dans `Full_DevOps_Lab/js-practice.js`, `hospitalData.js` et `main.js`. Leur exécution dans le terminal nous a permis de vérifier les résultats et de réaliser les captures de la partie individuelle.

## Partie 3 — Développement des API

Nous avons ajouté les routes dans `Full_DevOps_Lab/src/routes/auto/`. La lecture des données JSON est assurée par `express.json()` dans l’application Express.

| Route | Travail réalisé |
| --- | --- |
| `GET /api/doctors` | Renvoie la liste des médecins avec le statut 200. |
| `POST /api/doctors` | Ajoute un médecin à partir de son nom et de sa spécialité. Renvoie le statut 201 avec un identifiant, ou 400 si un champ obligatoire manque. |
| `GET /api/patients` | Renvoie la liste des patients avec le statut 200. |
| `POST /api/patients` | Ajoute un patient avec son nom et son âge. Renvoie 201 si les données sont acceptées, ou 400 si un champ manque ou si l’âge n’est pas un entier positif ou nul. |
| `POST /api/appointments` | Crée un rendez-vous avec un médecin, un patient et une date. Renvoie 201 avec un identifiant, ou 400 si un champ est manquant, vide ou non textuel, ou si la date est invalide. |
| `GET /api/metrics` | Renvoie le temps de fonctionnement du serveur, sa consommation mémoire et le nombre de médecins, de patients et de rendez-vous. |

Pour la partie rendez-vous de Badis, le développement correspond au ticket **DEVOPS-20**. Voici les données utilisées pour vérifier la création :

```json
{
  "doctor": "Dr. Lee",
  "patient": "Alice",
  "date": "2026-11-10T14:00:00Z"
}
```

La réponse contient les mêmes données et un identifiant numérique. Nous avons aussi ajouté des tests pour un champ manquant, un champ vide et une date invalide.

Les données des API sont stockées dans des tableaux en mémoire et sont réinitialisées au redémarrage du serveur. Les métriques utilisent ces mêmes tableaux pour calculer les compteurs.

## Partie 4 — Postman

Nous avons ajouté les collections Postman dans le dossier `postman/` :

- `Healthcare API Postman Collection.json` pour les médecins ;
- `Patients.postman_collection.json` pour les patients ;
- `Appointments.postman_collection.json` pour les rendez-vous ;
- `Metrics.postman_collection.json` pour les métriques.

Elles contiennent les requêtes et les assertions sur les statuts HTTP et les données renvoyées. Les collections médecins et patients comprennent également des requêtes avec des données incorrectes pour vérifier les réponses 400.

Pour les rendez-vous, l’envoi de la requête POST a renvoyé **201 Created**. Les deux tests Postman ont réussi : le contrôle du statut 201 et celui des données du rendez-vous, avec un identifiant numérique.

Les requêtes utilisent le serveur local sur `http://localhost:3000`. La collection Metrics utilise la variable `baseUrl`, à régler sur cette adresse ; cette valeur est déjà définie dans la collection Patients.

## Intégration et résultats des tests

Nous avons travaillé sur des branches distinctes, puis intégré les contributions par pull requests. Lors de l’intégration des rendez-vous, un conflit dans `app.js` concernait l’ajout de `express.json()`. Il a été résolu en conservant une seule déclaration globale.

La CI exécute l’installation des dépendances, ESLint et les tests Vitest avec couverture. Après la fusion de la pull request #23, l’exécution sur `main` au commit `88f9866` s’est terminée avec succès : **45 tests réussis dans 11 fichiers**.

| Couverture globale | Résultat |
| --- | ---: |
| Instructions | 95,74 % |
| Branches | 84,78 % |
| Fonctions | 88,88 % |
| Lignes | 96,47 % |

La couverture des lignes du dossier des routes atteint 100 %. Les seuils configurés dans Vitest sont respectés. Le rapport de couverture est disponible dans l’artefact `coverage-report` de GitHub Actions.

## Exécution du projet

Depuis la racine du dépôt :

```sh
cd Full_DevOps_Lab
npm ci
npm run lint
npm test -- --coverage
npm start
```

Le serveur démarre par défaut sur `http://localhost:3000`.

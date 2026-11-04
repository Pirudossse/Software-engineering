# Lab 5 — Compte rendu

À partir du projet du Lab 4, nous avons développé une API pour gérer les médecins, les patients et les rendez-vous d’un hôpital. Nous avons également ajouté une route de métriques, les tests associés et les collections Postman. Les contributions ont ensuite été regroupées sur `main`.

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

Cette partie a été réalisée individuellement. Les captures suivantes montrent les exercices de **Badis**, exécutés avec Node.js dans VS Code. Elles correspondent à sa version de travail ; certains noms et exemples sont différents dans la version regroupée du dépôt.

### 2.1 — Variables et conditions

J’ai créé les variables décrivant l’hôpital : son nom, le nombre de médecins et son état d’ouverture. Le terminal affiche le message d’accueil avec 12 médecins. Après avoir changé `isOpen` de `true` à `false`, la condition affiche que l’hôpital est fermé.

![Exercice 2.1 — code et résultat de Badis](captures/partie2/exercice_2_1.png)

### 2.2 — Tableaux, boucle et recherche

J’ai parcouru le tableau des médecins avec une boucle pour afficher chaque nom et son numéro. L’ajout de Dr. Julie avec `push` fait passer le nombre de médecins de cinq à six. J’ai ensuite testé la recherche : Dr. Lee est trouvé, tandis que Dr. Smith est absent de la liste.

![Exercice 2.2 — code et résultat de Badis](captures/partie2/exercice_2_2.png)

### 2.3 — Objet patient

J’ai représenté Alice Martin par un objet contenant son âge, ses maladies et les informations de son médecin. L’accès à `patient.doctor.name` permet d’afficher Dr. Lee et sa spécialité. Après l’ajout de `anxiety`, le tableau des maladies passe de deux à trois éléments.

![Exercice 2.3 — code et résultat de Badis](captures/partie2/exercice_2_3.png)

### 2.4 — Filtrage et ajout d’un patient

Avec `filterByAge(30)`, j’ai récupéré les patients de plus de 30 ans : Alice, 34 ans, et John, 45 ans. J’ai ensuite ajouté Lucas, 22 ans. Il apparaît dans la liste complète avec l’identifiant 4, calculé à partir du plus grand identifiant existant.

![Exercice 2.4 — code et résultat de Badis](captures/partie2/exercice_2_4.png)

### 2.5 — Séparation en modules

J’ai séparé les données et le programme principal dans deux fichiers. `hospitalData.js` exporte le tableau `doctors` et la fonction `addDoctor`, que `main.js` importe pour ajouter Dr. Julie. L’affichage avant et après l’appel confirme que la liste passe de deux à trois médecins. La configuration `"type": "module"` permet d’utiliser cette syntaxe.

![Exercice 2.5 — code et résultat de Badis](captures/partie2/exercice_2_5.png)

### 2.6 — Gestion des erreurs

J’ai testé `createAppointment` avec des données complètes, puis avec seulement le nom du médecin. Le premier appel renvoie le rendez-vous de Dr. Lee avec Alice au 10 novembre 2026. Le second déclenche « Missing required fields », récupéré par le bloc `catch`. Cela permet de signaler les données manquantes au lieu de créer un rendez-vous incomplet.

![Exercice 2.6 — code et résultat de Badis](captures/partie2/exercice_2_6.png)

### 2.7 — Code asynchrone

J’ai simulé la récupération des données de l’hôpital avec une promesse et un délai d’une seconde. Dans `showData`, `await` attend le résultat avant de l’afficher. Le terminal montre d’abord « Fetching hospital data... », puis « Data loaded » avec les données de Central Hospital. La valeur `uptime: 1234` est une donnée d’exemple.

![Exercice 2.7 — code et résultat de Badis](captures/partie2/exercice_2_7.png)

## Partie 3 — Développement des API

Les routes ont été ajoutées dans `Full_DevOps_Lab/src/routes/auto/`, en conservant le chargement automatique prévu dans le projet. Nous avons ajouté `express.json()` pour lire les données envoyées dans les requêtes POST.

### Médecins — Oussama

`GET /api/doctors` renvoie la liste des médecins avec le statut **200**. `POST /api/doctors` ajoute un médecin à partir de `name` et `specialty`, puis renvoie l’objet créé avec un identifiant et le statut **201**. Si un champ obligatoire manque, la route renvoie **400** avec un message d’erreur.

### Patients — Alban

`GET /api/patients` permet de consulter la liste des patients. Pour l’ajout, `POST /api/patients` attend un nom et un âge. Nous vérifions que l’âge est un entier positif ou nul. Une création valide renvoie **201** ; un champ manquant ou un âge incorrect renvoie **400**.

### Rendez-vous — Badis

J’ai développé `POST /api/appointments` dans le cadre du ticket **DEVOPS-20**. La route attend les champs `doctor`, `patient` et `date`. J’ai vérifié que ces trois valeurs sont des chaînes non vides. L’utilisation de `trim()` permet notamment de refuser un champ composé uniquement d’espaces.

La date est ensuite contrôlée avec `Date.parse`. Si elle n’est pas interprétable, la route renvoie **400** avec le message « Invalid date ». Lorsque les données sont acceptées, un identifiant est ajouté au rendez-vous, qui est enregistré puis renvoyé avec le statut **201**.

Exemple utilisé pour vérifier la création :

```json
{
  "doctor": "Dr. Lee",
  "patient": "Alice",
  "date": "2026-11-10T14:00:00Z"
}
```

J’ai ajouté quatre tests automatiques : une création valide, un champ manquant, un champ vide et une date invalide. Ils vérifient le statut de la réponse et, pour la création, les données renvoyées ainsi que la présence d’un identifiant numérique.

### Métriques — Eliott

`GET /api/metrics` renvoie le temps de fonctionnement du serveur en secondes, sa consommation mémoire en octets et les compteurs `doctorsCount`, `patientsCount` et `appointmentsCount`. Les compteurs lisent directement la taille des tableaux utilisés par les autres routes : chaque ajout accepté est donc pris en compte.

Les données restent stockées en mémoire et sont réinitialisées au redémarrage du serveur. Les rendez-vous enregistrent les noms sous forme de texte ; le contrôle des conflits de créneaux et la vérification de l’existence du médecin et du patient ne sont pas implémentés.

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

## Commandes de vérification et de lancement

Depuis la racine du dépôt :

```sh
cd Full_DevOps_Lab
npm ci
npm run lint
npm test -- --coverage
npm start
```

Le serveur démarre par défaut sur `http://localhost:3000`.

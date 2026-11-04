# Lab 5 — Compte rendu

À partir du projet du Lab 4, nous avons travaillé sur une API de gestion d’hôpital : médecins, patients, rendez-vous et métriques. Ce rapport présente nos exercices JavaScript, les vérifications de l’API et l’intégration sur GitHub.

Dépôt : [Software-engineering](https://github.com/Pirudossse/Software-engineering)

## Répartition du travail

Les exercices JavaScript ont été réalisés individuellement. Pour l’API, nous avons réparti les tâches ainsi :

| Membre | Partie | Ticket Jira |
| --- | --- | --- |
| Badis | Rendez-vous — `/api/appointments` | DEVOPS-20 |
| Oussama | Médecins — `/api/doctors` | DEVOPS-15 |
| Alban | Patients — `/api/patients` | DEVOPS-19 |
| Eliott | Métriques — `/api/metrics` | DEVOPS-21 |

## Partie 2 — Exercices JavaScript

### 2.1 — Variables et conditions

Dans la version de Badis, les variables décrivent le nom de l’hôpital, ses 12 médecins et son état d’ouverture. Le terminal affiche le message d’accueil, puis le message de fermeture après le passage de `isOpen` à `false`.

![Badis — variables, condition et résultat](js_badis_21.png)

### 2.2 — Tableaux, boucle et recherche

La boucle affiche les cinq médecins avec leur numéro. L’ajout de Dr. Julie avec `push` fait passer le total à six. La recherche trouve Dr. Lee et indique que Dr. Smith est absent.

![Badis — tableau des médecins et recherches](js_badis_22.png)

### 2.3 — Objet patient

L’objet représente Alice Martin, ses maladies et son médecin. L’accès aux propriétés du médecin permet d’afficher Dr. Lee et sa spécialité, Cardiology. Après l’ajout de `anxiety`, la liste contient trois maladies.

![Badis — objet patient et propriétés imbriquées](js_badis_23.png)

### 2.4 — Filtrage et ajout d’un patient

L’appel `filterByAge(30)` renvoie Alice, 34 ans, et John, 45 ans. Lucas, 22 ans, est ensuite ajouté avec l’identifiant 4, calculé à partir du plus grand identifiant existant.

![Badis — filtrage et ajout de Lucas](js_badis_24.png)

### 2.5 — Séparation en modules

`hospitalData.js` contient le tableau `doctors` et la fonction `addDoctor`. `main.js` les importe pour ajouter Dr. Julie. L’affichage avant et après l’appel montre que la liste passe de deux à trois médecins. Le fichier `package.json` contient la configuration `"type": "module"`.

![Badis — hospitalData.js](modules_donnees.png)

![Badis — main.js et résultat](modules_main.png)

![Badis — configuration des modules](modules_configuration.png)

### 2.6 — Gestion des erreurs

Le premier appel de `createAppointment` crée un rendez-vous entre Dr. Lee et Alice au 10 novembre 2026. Le second appel fournit seulement le médecin : l’erreur `Missing required fields` est récupérée par le bloc `catch`.

![Badis — création du rendez-vous et erreur interceptée](js_badis_26.png)

### 2.7 — Code asynchrone

La récupération des données est simulée par une promesse avec un délai d’une seconde. Dans `showData`, `await` attend le résultat avant son affichage. Le terminal montre « Fetching hospital data... », puis les données de Central Hospital. La valeur `uptime: 1234` est une donnée d’exemple.

![Badis — promesse, await et résultat](js_badis_27.png)

### Exécution des exercices d’Oussama

Les captures suivantes montrent aussi le code d’Oussama et les résultats des six exercices exécutés dans `js-practice.js` : variables, tableaux, objet patient, fonctions, erreurs et code asynchrone. Ses données d’exemple diffèrent légèrement de celles de Badis : le patient ajouté est notamment Karim, 52 ans.

![Oussama — js-practice.js, capture 1](js_oussama_code_1.png)

![Oussama — js-practice.js, capture 2](js_oussama_code_2.png)

![Oussama — js-practice.js, capture 3](js_oussama_code_3.png)

![Oussama — js-practice.js, capture 4](js_oussama_code_4.png)

![Oussama — résultats des six exercices JavaScript](js_oussama_terminal.png)

![Oussama — hospitalData.js, main.js et exécution](js_oussama_modules.png)

## Partie 3 — API et tests automatiques

### Organisation des routes

Le dossier `Full_DevOps_Lab/src/routes/auto/` regroupe les quatre fichiers liés à l’hôpital : `doctors.route.js`, `patients.route.js`, `appointments.route.js` et `metrics.route.js`. Il contient également les routes techniques du projet précédent.

![GitHub — contenu du dossier des routes](github_routes.png)

### Médecins — Oussama

La capture de `doctors.route.js` montre les deux opérations. `GET /api/doctors` renvoie le tableau des médecins avec le statut 200. `POST /api/doctors` récupère `name` et `specialty`, ajoute un médecin avec un identifiant et renvoie 201. Si un champ obligatoire manque, la réponse est 400 avec le message `Missing required fields`.

Cette capture correspond à une version de travail dans VS Code.

![Oussama — code de la route médecins](doctors_code.png)

Dans `doctors.test.js`, trois tests vérifient la consultation, la création et le refus d’une requête incomplète. Les assertions portent sur les statuts, le type tableau, la présence d’un identifiant et les données renvoyées.

![Oussama — code des trois tests médecins](doctors_tests_code.png)

### Vérification dans le navigateur

La capture d’ensemble montre les réponses JSON des médecins, des patients et des métriques lors d’une première vérification. À ce moment-là, le GET des rendez-vous n’était pas encore ajouté : son panneau affiche donc `Cannot GET /api/appointments`.

![Première vérification des quatre URL — avant ajout du GET rendez-vous](navigateurs_avant_get.png)

Badis a ensuite ajouté le GET des rendez-vous. La capture suivante montre la réponse obtenue après cette correction : un tableau contenant le rendez-vous de Dr. Lee avec Alice. L’URL `/api/appointments` est visible dans le navigateur.

![Rendez-vous — réponse JSON dans le navigateur après correction](appointments_navigateur.png)

### Vérification du lint et des tests

La commande `npm run lint` se termine sans message d’erreur et rend la main au terminal.

![Terminal — npm run lint sans erreur](lint_terminal.png)

La capture locale ci-dessous correspond à une exécution antérieure à l’ajout du test GET des rendez-vous : **45 tests réussis dans 11 fichiers**. Le résultat après cet ajout est présenté dans la section GitHub Actions : **46 tests réussis dans 11 fichiers**.

![Terminal — exécution locale des tests avec couverture, avant ajout du test GET](tests_locaux_45.png)

## Partie 4 — Vérifications avec Postman

### Médecins — Oussama

Le GET renvoie les médecins avec le statut 200. Le POST valide crée un médecin et renvoie 201. Un POST sans spécialité est refusé avec le statut 400.

![Médecins — GET et réponse 200](doctors_get.png)

![Médecins — POST et réponse 201](doctors_post.png)

![Médecins — champ manquant et réponse 400](doctors_post_incomplet.png)

### Patients — Alban

Le GET renvoie Alice et John avec le statut 200. Le POST crée Marie, 29 ans, avec l’identifiant 3 et le statut 201. Les onglets de résultats indiquent respectivement 3/3 et 2/2 tests réussis.

![Alban — GET patients, réponse 200](patients_get.jpg)

![Alban — création de Marie, réponse 201](patients_post.jpg)

Le lancement de la collection patients donne **8 tests réussis, aucun échec**. Il comprend aussi deux cas refusés avec le statut 400 : un champ manquant et un âge incorrect.

![Alban — Run collection, 8 tests réussis](patients_collection.jpg)

### Rendez-vous — Badis

Le POST valide crée un rendez-vous entre Dr. Lee et Alice pour le `2026-11-10T14:00:00Z`. Les deux tests passent : statut 201 et vérification des données, dont un identifiant numérique.

![Badis — POST rendez-vous, 201 et deux tests réussis](appointments_post.png)

Le GET renvoie un tableau avec le statut 200. Les deux assertions vérifient le statut et le type de la réponse.

![Badis — GET rendez-vous et contenu JSON](appointments_get_json.png)

![Badis — deux tests GET réussis](appointments_get_tests.png)

Pour le cas incomplet, le corps de la requête contient seulement `doctor`. L’API renvoie 400. Les tests confirment ce statut et la présence d’un message d’erreur.

![Badis — champ manquant, 400 et deux tests réussis](appointments_post_incomplet.png)

Le Run collection regroupe ces trois requêtes : **6 tests réussis, 0 échec et 0 erreur**. Le statut 400 du cas incomplet est le résultat attendu.

![Badis — Run collection des rendez-vous](appointments_collection.png)

### Métriques — Eliott

`GET /api/metrics` renvoie 200 et les cinq valeurs visibles dans la réponse : `uptime`, `memoryUsage`, `doctorsCount`, `patientsCount` et `appointmentsCount`. Sur cette exécution, les compteurs valent 2 médecins, 2 patients et 0 rendez-vous. L’onglet des résultats indique **6/6 tests réussis**. Les assertions visibles vérifient notamment que les compteurs des patients et des rendez-vous sont des entiers positifs ou nuls.

![Eliott — métriques, réponse 200 et six tests réussis](metrics_get.png)

### Exécution d’une collection regroupée

Oussama a également exécuté une collection comprenant sept requêtes sur les médecins, les patients, les rendez-vous et les métriques. Le résultat affiché est de **12 tests réussis, aucun échec et aucune erreur**. Les captures des différentes collections correspondent à des exécutions distinctes.

![Collection regroupée — 12 tests réussis](postman_collection_regroupee.png)

## Jira — Suivi du travail

Le backlog affiche les quatre stories DEVOPS-15, DEVOPS-19, DEVOPS-20 et DEVOPS-21 à l’état **Terminé**, avec leur rattachement à l’epic « API Core… » visible sur les tickets.

![Jira — quatre stories et leur rattachement à l’epic](jira_backlog.png)

## GitHub — Pull requests et intégration

Les contributions ont été intégrées dans `main` par pull requests. Les captures d’Oussama montrent la fusion de la partie médecins ainsi que la validation des checks.

![Pull request médecins — titre DEVOPS-15 et fusion](pr_doctors_fusion.png)

![Pull request — All checks have passed](pr_checks.png)

Pour les rendez-vous, la pull request **#24**, intitulée « DEVOPS-20 : ajout du GET des rendez-vous et de son test », a été fusionnée dans `main` au commit `3c1f502`. La capture de fusion est suivie du résultat de la CI sur ce commit.

![Pull request 24 — ajout du GET rendez-vous et fusion](pr_24_fusion.png)

### GitHub Actions

L’exécution **#44** sur `main`, au commit `3c1f502`, est en **Success**. Le rapport Vitest affiche **46 tests réussis dans 11 fichiers**, sans échec.

![GitHub Actions — succès sur main et 46 tests réussis](ci_46_tests.png)

Le détail du job montre la réussite des étapes de récupération du dépôt, de configuration de Node.js, d’installation des dépendances, de lint, de tests avec couverture et de dépôt de l’artefact de couverture. Les étapes de préparation et de nettoyage du job apparaissent également.

![GitHub Actions — détail des étapes réussies](ci_etapes.png)

## Intégration Jira ↔ GitHub

Le panneau Développement de la story **DEVOPS-15** affiche les éléments associés au travail d’Oussama : **2 branches, 4 commits, 2 pull requests fusionnées et 1 build réussi**. Cette capture montre le lien entre la story Jira et les contributions GitHub.

![Jira — branches, commits, pull requests fusionnées et build de DEVOPS-15](jira_developpement.png)


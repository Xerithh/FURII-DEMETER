# FURII-DEMETER : Plateforme d'évaluation et de recommandation 🏥🎓

## 📝 Présentation du projet
Ce projet s'inscrit dans le cadre du centre de ressources pédagogiques **FURII-DEMETER**. L'objectif est de concevoir une application web interactive permettant d'évaluer les compétences des apprenants selon le référentiel de l'école **ISIS - INU Champollion** et de leur recommander automatiquement des modules de formation adaptés pour atteindre le niveau requis du diplôme d'ingénieur[cite: 13, 15].

Ce projet tuteuré FIE-3 valide nos capacités en conception logicielle, gestion de données et développement web[cite: 17, 18].

## 🛠 Stack Technique
Le projet utilise une architecture découplée (SaaS style) :
* **Frontend :** Vue.js (Framework interactif) 
* **Backend :** Spring Boot (Java) 
* **Base de données :** PostgreSQL ou MySQL (Relationnelle) 
* **Gestion de projet :** Méthode Agile, Trello et Gantt[cite: 26, 33].

## 📂 Structure du dépôt
* `/frontend` : Code source de l'interface utilisateur (Vue.js).
* `/backend` : Code source de l'API et logique métier (Spring Boot).
* `/docs` : Documentation technique, schémas UML et modèles de données[cite: 33].
* `/sql` : Scripts d'initialisation de la base de données.

## 🚀 Installation (Mode Développement)
*(Section à compléter lors de l'initialisation des dossiers)*

### Prérequis
* Java 17+
* Node.js 18+
* Docker (recommandé pour la BDD)

### Lancement du Backend
```bash
cd backend
./mvnw spring-boot:run

# Outil de Gestion de Projet (PMT) - Frontend (Angular)

## Prérequis

- Docker

## Déploiement Docker

> ⚠️ Le frontend est **déjà pris en charge** par le `docker-compose.yml` du backend si les deux projets sont clonés côte à côte.

### Pour le déployer seul (optionnel)

1. **Placez-vous dans le dossier `project_pmt-frontend` :**

   ```bash
   cd project_pmt-frontend
   ```

2. **Créer et démarrer le conteneur :**
   ```bash
   docker build -t pmt-frontend .
   docker run -p 8081:80 pmt-frontend
   ```

## 📌 Accès

- **Interface Frontend** : http://localhost:4200/

> Le backend doit être accessible à http://localhost:8080/ pour que le frontend fonctionne correctement.

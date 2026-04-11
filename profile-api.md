# API REFERENCE - GESTION DU PROFIL (ISISU)

## 1. Récupérer le profil actuel
**Endpoint :** `GET /api/v1/profil/me`
**Description :** Récupère l'intégralité des informations personnelles de l'utilisateur authentifié.

**Structure de la réponse :**
- `id` (int), `email` (string), `nom` (string), `prenom` (string)
- `role` (enum: ETUDIANT_FIE3, etc.)
- `statut` (enum: ACTIF, etc.)
- `telephone`, `dateNaissance` (YYYY-MM-DD), `adresse`, `codePostal`, `ville`, `nationalite`
- `photoUrl` (string)
- `emailVerifie` (boolean)
- `dateInscription`, `derniereConnexion`, `dateModification` (ISO-8601)

---

## 2. Mettre à jour le profil
**Endpoint :** `PUT /api/v1/profil/me`
**Description :** Modifie les informations modifiables de l'utilisateur connecté.

**Champs modifiables (Request Body) :**
- `nom`, `prenom`
- `telephone` (ex: "0601020304")
- `dateNaissance` (format: "YYYY-MM-DD")
- `adresse`, `codePostal`, `ville`, `nationalite`
- `photoUrl`

---

## 3. Changer le mot de passe
**Endpoint :** `POST /api/v1/profil/me/password`
**Description :** Procédure sécurisée de changement de mot de passe.

**Structure du Body :**
- `ancienMotDePasse` (string)
- `nouveauMotDePasse` (string)
- `confirmationMotDePasse` (string) : Doit être identique au nouveau mot de passe.

---

## 4. Désactivation du compte
**Endpoint :** `DELETE /api/v1/profil/me`
**Description :** Réalise un "soft delete" (désactivation) du compte de l'utilisateur authentifié. Le statut passera de `ACTIF` à un état désactivé.

---

## 5. Consulter un profil tiers
**Endpoint :** `GET /api/v1/profil/{id}`
**Description :** Permet de consulter les informations publiques ou administratives d'un utilisateur spécifique via son ID (utile pour la partie Admin ou Social).

---

## Modèle de Données "User Profile" (Full)
```json
{
  "id": 0,
  "email": "user@univ-jfc.fr",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "ETUDIANT_FIE3",
  "statut": "ACTIF",
  "telephone": "0600000000",
  "dateNaissance": "2000-01-01",
  "adresse": "Avenue Georges Pompidou",
  "codePostal": "81100",
  "ville": "Castres",
  "nationalite": "Française",
  "photoUrl": "[https://url-de-la-photo.com](https://url-de-la-photo.com)",
  "emailVerifie": true
}

# Flappy Bird (PWA)

Flappy Bird en HTML5 Canvas + JavaScript vanilla, installable sur mobile et jouable hors-ligne.

## Lancer en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Installer sur mobile

- **Android (Chrome)** : menu ⋮ → « Installer l'application ».
- **iOS (Safari)** : Partager → « Sur l'écran d'accueil ».

## Déploiement (GitHub Pages)

1. Pousser le dépôt sur GitHub (branche `main`).
2. Settings → Pages → Source : **GitHub Actions**.
3. Le workflow `.github/workflows/pages.yml` publie le site sur `https://<utilisateur>.github.io/<repo>/`.

## Mise à jour

Incrémenter `CACHE` (`flappy-v1` → `flappy-v2`) dans `sw.js` à chaque déploiement pour que les clients récupèrent la nouvelle version.

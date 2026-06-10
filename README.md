---

## Portofoliu Web

Website-ul prezintă un portofoliu personal cu informații despre profil profesional, experiență, educație și o galerie cu proiecte GitHub.

## Funcționalități

- Pagina hero cu poza de profil, nume și descriere rolului profesional
- Secțiune cu experiență și educație
- Afișare dinamică a proiectelor din GitHub
- Căutare după nume proiect
- Filtrare după limbaj de programare
- Sortare după data ultimei actualizări sau după numărul de stele
- Paginație cu buton "Încarcă mai multe" pentru a vedea cate 6 proiecte pe pagină
- Exclude proiectele care sunt fork-uri
- Fallback automat la proiecte locale dacă GitHub API nu este disponibil

## Cum funcționează

La deschidere, site-ul preia automat repositoriile din GitHub-ul utilizatorului. Utilizatorul poate căuta rapid dintre proiecte, le poate filtra după limbajul de programare folosit, le poate sorta și le poate vedea gradual prin paginație.

## Fișiere principale

- index.html - Structura paginii
- script.js - Logica pentru preluarea proiectelor din GitHub, căutare, filtrare și sortare
- `style.css` - Design-ul și stilurile
- `data/fallback-projects.json` - Proiecte locale ca backup dacă GitHub API nu funcționează

---

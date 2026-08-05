# Camila Rosas — Chat Landing

Réplica mejorada del chat de contacto (estilo WhatsApp).  
Textos, links y lógica idénticos al original. Assets locales.

## Probar en local

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Luego ve a `http://localhost:8080`

## Publicar en GitHub Pages

1. Crea un repo en GitHub (ej. `cami-pagina`)
2. Sube este proyecto:

```bash
git init
git add .
git commit -m "Landing chat Camila Rosas"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/cami-pagina.git
git push -u origin main
```

3. En GitHub: **Settings → Pages**
4. Source: **Deploy from a branch**
5. Branch: `main` / carpeta `/ (root)` → Save
6. En 1–2 min tu web estará en:

`https://TU-USUARIO.github.io/cami-pagina/`

## Estructura

```
├── index.html
├── css/styles.css
├── js/app.js
├── assets/          # fotos, fondo e iconos
└── README.md
```

## Links WhatsApp

| Opción | Link |
|--------|------|
| Contenido Exclusivo | https://wa.link/whatsappcamilarosas |
| Solo quiero conversar | https://wa.link/kbg1we |
| Videollamadas / Salidas | Sin botón WA (solo volver al menú) |

Para cambiar links: edita `js/app.js` (`CF_LINK` y `CF_LINK_PLATICAR`).

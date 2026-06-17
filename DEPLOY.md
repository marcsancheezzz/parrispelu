# Roger Barber — Guia de desplegament (Netlify + Supabase)

Aquesta app ja no guarda res al mòbil de cadascú (localStorage): ara tot es guarda
a una base de dades real al núvol, així que qualsevol persona que entri des de
qualsevol mòbil o ordinador veu les mateixes dades (reserves, horaris, serveis).

Has de fer dues coses una sola vegada: crear la base de dades a Supabase (gratuït)
i pujar aquest projecte a Netlify connectant-lo amb la base de dades.

## Pas 1 — Crear el projecte a Supabase

1. Vés a https://supabase.com i crea un compte (pots fer-ho amb Google).
2. Crea un projecte nou ("New project"). Tria una contrasenya de base de dades
   (guarda-la, no la necessitaràs gaire més però per si de cas).
3. Un cop creat el projecte (triga un parell de minuts a aixecar-se), vés a
   l'apartat "SQL Editor" del menú lateral.
4. Obre el fitxer `supabase-schema.sql` (l'has rebut amb aquest projecte),
   copia tot el contingut i enganxa'l a l'editor SQL de Supabase. Prem "Run".
   Això crea les taules de reserves, horaris i serveis amb les dades inicials
   (dilluns tancat, Tallat 15€, Tallat i barba 15€, Tenyit 50€).
5. Vés a "Project Settings" (engranatge) > "API". Apunta't dos valors:
   - **Project URL** (s'assembla a `https://xxxxx.supabase.co`)
   - **service_role key** (NO la "anon public", la **service_role**, que és secreta)

## Pas 2 — Pujar el projecte a Netlify

1. Vés a https://netlify.com i crea un compte (també pots fer-ho amb Google).
2. La manera més senzilla: puja aquesta carpeta sencera a un repositori de GitHub
   (crea un repo nou, puja-hi tots els fitxers), i després a Netlify fes
   "Add new site" > "Import an existing project" > connecta el teu GitHub >
   tria el repositori.
   - Si no vols usar GitHub, Netlify també permet arrossegar la carpeta directament
     ("Deploy manually"), però llavors no podràs actualitzar-ho fàcilment més
     endavant ni les funcions de servidor funcionaran igual de bé. Es recomana GitHub.
3. Un cop importat, antes de fer el primer desplegament (o just després, a
   "Site settings" > "Environment variables"), afegeix aquestes tres variables:
   - `SUPABASE_URL` → el Project URL que vas copiar abans
   - `SUPABASE_SERVICE_KEY` → la service_role key que vas copiar abans
   - `ADMIN_PASSWORD` → la contrasenya que vulguis per entrar a "Gestió"
     (per exemple `roger2025`, o la que prefereixis)
4. Desplega el lloc ("Deploy site"). Al cap d'un minut tindràs una URL del
   tipus `https://nom-aleatori.netlify.app`. Pots canviar aquest nom a
   "Site settings" > "Site details" > "Change site name".

## Com funciona un cop desplegat

- Qualsevol persona que obri la URL veu el calendari amb els dies/hores ja
  ocupades per altres clients (sense veure de qui són), i pot reservar-ne
  de lliures.
- Cada client s'identifica només pel seu telèfon (sense contrasenya): quan
  reserva, el mòbil "recorda" el seu telèfon, i la secció "Les meves cites"
  li mostra automàticament les seves properes visites i l'historial de
  visites passades amb Roger.
- Tu (Roger) entres a "Gestió" mantenint premut el logo del header 2 segons,
  i després amb la contrasenya que vas posar a `ADMIN_PASSWORD`. Des d'allà
  veus totes les reserves de tothom, marques pagaments, edites horaris i
  serveis.
- Com que ara és una base de dades real, si tu reserves des del mòbil i jo
  miro des de l'ordinador, els dos veiem exactament el mateix.

## Si cal canviar alguna cosa més endavant

- Per canviar la contrasenya d'administrador: ves a Netlify > Site settings >
  Environment variables > edita `ADMIN_PASSWORD` > torna a desplegar el lloc
  (Netlify ho sol fer sol, o pots forçar-ho a "Deploys" > "Trigger deploy").
- Els horaris i serveis es poden seguir editant tranquil·lament des de la
  mateixa secció de Gestió, sense tocar res més.

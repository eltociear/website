# **Guide: Git & Vårt Dokumentationsflöde**

Välkommen till ryggraden i vårt samarbete. Allt vårt arbete – från ramverkstexter till projektplaner – lagras och utvecklas med hjälp av ett system som heter **Git** och en plattform som heter **GitHub**.

  * **Varför använder vi det?** För att kunna arbeta tillsammans på ett öppet, transparent och asynkront sätt. Det fungerar som en "tidsmaskin" som låter oss se alla ändringar som gjorts, av vem och varför. Det är avgörande för att vår autonoma arbetsmodell ska fungera.

## **Kom igång: Dina verktyg**

Du kan välja den väg som passar dig bäst. För nybörjare rekommenderar vi den visuella vägen.

  * **Alternativ 1: Den visuella vägen (Rekommenderas för nybörjare)**

    1.  **Skapa ett konto:** Gå till [GitHub.com](https://github.com) och skapa ett gratis konto.
    2.  **Installera GitHub Desktop:** Ladda ner och installera [GitHub Desktop](https://desktop.github.com/). Detta program blir din huvudsakliga "kontrollpanel".

  * **Alternativ 2: Terminalvägen (För den tekniskt nyfikne)**

    1.  **Skapa ett konto:** Gå till [GitHub.com](https://github.com) och skapa ett gratis konto.
    2.  **Installera Git:** Se till att du har Git installerat på din dator.
          * På **Linux** (som du använder) är det oftast förinstallerat. Annars: `sudo apt-get install git` (Debian/Ubuntu) eller motsvarande för din distribution.
          * På **Mac** kan du installera det via `xcode-select --install` i Terminalen.
          * På **Windows** är det enklast att installera [Git for Windows](https://git-scm.com/download/win), vilket ger dig programmet "Git Bash".

## **Vårt arbetsflöde: Från idé till färdigt bidrag**

Här är vår process i sex steg. För varje steg visas båda metoderna.

### **Steg 0: Hitta eller skapa en uppgift (GitHub Issues)**

Detta steg är detsamma oavsett vilken väg du väljer, eftersom det sker på GitHubs webbplats. Innan du börjar arbeta, hitta eller skapa en **"Issue"** (uppgift) på projektets "Issues"-flik. Detta säkerställer att allt arbete är kopplat till ett specifikt mål.

### **Steg 1: Skapa en arbetsyta (Create a Branch)**

Allt arbete sker i en egen "gren" (Branch) för att hålla huvudprojektet rent och stabilt.

  * **Visuella vägen (GitHub Desktop):**

    1.  Klicka på "Current Branch" högst upp.
    2.  Klicka på "New Branch".
    3.  Döp din gren enligt mönstret `dina-initialer/issue-nummer-beskrivning` (t.ex. `bkh/21-förbättra-git-guiden`).

  * **Terminalvägen (Kommandoraden):**

    1.  Se till att du har den senaste versionen av huvudprojektet och står på huvudgrenen (`main`).
        ```bash
        # Byt till huvudgrenen
        git checkout main

        # Hämta de senaste ändringarna från GitHub
        git pull origin main
        ```
    2.  Skapa och byt till din nya gren med ett enda kommando.
        ```bash
        # Skapa en ny gren och byt till den
        git checkout -b bkh/21-förbättra-git-guiden
        ```

### **Steg 2: Gör ändringarna**

Detta är det kreativa arbetet och görs i din favorittextredigerare, oavsett arbetsflöde.

  * **En snabbguide till Markdown:**
      * `# Rubrik 1`
      * `## Rubrik 2`
      * `**Fet text**`
      * `*Kursiv text*`
      * `- En punkt i en lista`
      * `[En länk till GGF](https://globalgovernanceframeworks.org)`

### **Steg 3: Spara ditt arbete (Commit)**

En "Commit" är en sparad loggbokspost över dina ändringar.

  * **Visuella vägen (GitHub Desktop):**

    1.  Skriv en kort, beskrivande sammanfattning i fältet "Summary".
    2.  Klicka på knappen "Commit to `[ditt-gren-namn]`".

  * **Terminalvägen (Kommandoraden):**

    1.  Lägg till de filer du vill spara i "staging area".
        ```bash
        # Lägg till alla ändrade filer
        git add .
        ```
    2.  Skapa din "commit" med ett tydligt meddelande.
        ```bash
        # Spara de "stagede" filerna med ett meddelande
        git commit -m "Förtydligade arbetsflödet i git-guiden"
        ```

### **Steg 4: Publicera din arbetsyta (Push)**

Ladda upp dina sparade ändringar (commits) till GitHub.

  * **Visuella vägen (GitHub Desktop):**

      * Klicka på knappen **"Push origin"**.

  * **Terminalvägen (Kommandoraden):**

      * Första gången du pushar en ny gren använder du `-u` för att koppla din lokala gren till den på GitHub.
        ```bash
        # Ladda upp din gren till GitHub
        git push -u origin bkh/21-förbättra-git-guiden
        ```
      * Efterföljande gånger på samma gren räcker det med `git push`.

### **Steg 5: Föreslå din ändring (Pull Request)**

När du är klar, skapa en "Pull Request" (PR) för att be om att få ditt arbete införlivat i huvudprojektet. Detta steg sker på GitHubs webbplats.

  * **Hur gör man?**
    1.  Efter att du har "pushat" din gren, gå till projektets sida på GitHub.
    2.  Du kommer se en gul ruta med namnet på din gren och en knapp: **"Compare & pull request"**. Klicka på den.
    3.  Ge din PR en tydlig titel och beskrivning. Skriv "Closes \#21" (ersätt med rätt nummer) i beskrivningen för att koppla den till din "Issue".
    4.  Klicka på "Create Pull Request".

Nu är ditt bidrag inlämnat för granskning. Detta system är hjärtat i hur vi kan bygga projektet tillsammans på ett transparent och strukturerat sätt.

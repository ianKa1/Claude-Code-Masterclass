## Heists model/type using skill
can you use the firestore-schemas skill to setup types for heist documents, which will eventually be saved to firestore? Heists must have a title, description, createdBy (uid), createdByCodename (their codename/displayName), createdFor (uid), createdForCodename (their codename), deadline (a Date, 48 hours 
from when it was created), isActive (bool), finalStatus (either success or failure). 
---

## Heists create form
/spec is running… let's spec out the 'create heist' form in @app/(dashboard)/heists/create/page.tsx so that it creates a new heist document in firestore (in a heists collection), and then redirects the user to the /heists page once done. Figma: use the 'Create Heist' page design in Figma as a design reference.
---

## Fetch heists hook
spec is running… let's make a hook for accessing heists data from the firestore collection, called useHeists, which can later be used in the /heists page. It should access real-time data and return an array of heist objects.
---

## Spash page using design-skill
Can you use the frontend-design skill to design a better welcome/splash page for new users to the site, who don't yet have an account. It should have a 'register' button directing to /signup. The page is @app/(public)/page.tsx.



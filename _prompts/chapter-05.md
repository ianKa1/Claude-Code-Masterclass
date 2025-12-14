## Heists model/type using skill
can you use the firestore-schemas skill to setup types for heist documents, which will eventually be saved to firestore? Heists must have a title, description, createdBy (uid), createdByCodename (their codename/displayName), createdFor (uid), createdForCodename (their codename), deadline (a Date, 48 hours 
from when it was created), isActive (bool), finalStatus (either success or failure). 
---
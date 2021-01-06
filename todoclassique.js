const { urlencoded } = require("express");
const express = require("express");
let mongo = require("mongodb");
let serveur = express();

serveur.use(express.urlencoded({ extented: false })); // a ajouter pour recuperer des données dans un formulaire;

let db;
let connectionString =
  "mongodb+srv://celinebrion:Matthew2012@cluster0.uubwq.mongodb.net/todo-app?retryWrites=true&w=majority";

let options = { useNewUrlParser: true, useUnifiedTopology: true };

mongo.connect(connectionString, options, (err, client) => {
  /* console.log(err); /*si on veux voir les erreurs */
  db = client.db();
  serveur.listen(3000); // ne le mettre qu'apres une fois que tout est lancé
});

//call back en JS on lance plusieurs chose

// serveur.get('/', (pageDAccueil))

// serveur.get ('/', function()) //fonction anonyme

serveur.get("/", (req, res) => {
  db.collection("choses")
    .find()
    .toArray((err, choses) => {
      console.log(choses);

      let lesLIEnConstruction = "";
      choses.forEach((objetChose) => {
        const chose = objetChose.contenu;

        const nouveauLI = `<li
                                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                                <span>${chose}</span>
                                  <div>
                                    <button class="mr-1 btn btn-secondary btn-sm">Éditer</button>
                                    <button class="btn btn-danger btn-sm">Supprimer</button>
                                  </div>
                              </li>`;

        lesLIEnConstruction += nouveauLI;
      });

      const htmlAEnvoyer = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title> Bonjour </title>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
      />
    </head>
    <body>
      <div class="container">
        <h1 class="py-1 text-center display-4">Choses à faire</h1>
  
        <div class="p-3 shadow-sm jumbotron">
  
          <form action ="/ajouter" method="POST">
            <div class="d-flex align-items-center">
              <input
                class="mr-3 form-control"
                type="text"
                autofocus
                autocomplete="off"
                style="flex: 1"
                name="chose"
              />
              <button class="btn btn-primary" id="send">Ajouter</button>
            </div>
          </form>
          </div>
  
        <ul class="pb-5 list-group">
          ${lesLIEnConstruction}
        </ul>
      </div>
    </body>
  </html>
  `;
      res.send(htmlAEnvoyer);
    });
});

serveur.post("/ajouter", function (req, res) {
  // res.send('bien recu');
  //recuperer la valeur du formulaire

  // console.log(req.body.chose); tester le reponse
  let nouvelleChose = { contenu: req.body.chose };
  db.collection("choses").insertOne(nouvelleChose, () => {
    res.send("bien recu");
  });
});

// ou serveur.post('/ajouter',(req,res) =>{
//   res.send('bien recu')
// })

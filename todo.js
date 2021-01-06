const { urlencoded } = require("express");
const express = require("express");
let mongo = require("mongodb");

let serveur = express();

serveur.use(express.json());
serveur.use(express.urlencoded({ extented: false })); // a ajouter pour recuperer des données dans un formulaire;
serveur.use(express.static("public"));

let db;
let connectionString =
  "mongodb+srv://celinebrion:Matthew2012@cluster0.uubwq.mongodb.net/todo-app?retryWrites=true&w=majority";

let options = { useNewUrlParser: true, useUnifiedTopology: true };

mongo.connect(connectionString, options, (err, client) => {
  /* console.log(err); /*si on veux voir les erreurs */
  db = client.db();
  serveur.listen(3000); // ne le mettre qu'apres une fois que tout est lancé
});

serveur.get("/", (req, res) => {
  db.collection("choses")
    .find()
    .toArray((err, choses) => {
      res.send(
        `
        <!DOCTYPE html>
        <html>
          <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>A faire</title>
            <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
            />
            </head>
            <body>
            <div class="container">
              <h1 class="py-1 text-center display-4">Choses à faire</h1>
    
              <div class="p-3 shadow-sm jumbotron">
              <form action="/ajouter" method="POST">
              <div class="d-flex align-items-center">
              <input
              name="chose"
              class="mr-3 form-control"
                      type="text"
                      autofocus
                      autocomplete="off"
                      style="flex: 1"
                    />
                    <button class="btn btn-primary">Ajoutez</button>
                    </div>
                    </form>
                    </div>
    
                    <ul class="pb-5 list-group">
                      ${choses.map(chose => `
                        <li
                          class="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                          >
                          <span class="chose-text">${chose.contenu}</span>
                          <div>
                          <button class="mr-1 btn btn-secondary btn-sm btn-edition" data-id=${chose._id} >Éditer</button>
                          <button class="btn btn-danger btn-sm btn-suppression" data-id=${chose._id}>Supprimer</button>
                          </div>
                        </li>`
        ).join(' ')}
                    </ul>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
                <script src="/client.js"></script>
          </body>
          </html>
          `
      );
    });
});

serveur.post("/ajouter", (req, res) => {
  // res.send('bien recu');
  //recuperer la valeur du formulaire

  //console.log(req.body.chose); //tester la reponse
  let nouvelleChose = { contenu: req.body.chose };
  db.collection("choses").insertOne(nouvelleChose, () => {
    res.redirect("/");
  });
});

// ou serveur.post('/ajouter',(req,res) =>{
//   res.send('bien recu')
// })

serveur.post("/editer", (req, res) => {
  const nouveauContenu = req.body.contenu;
  const idChose = req.body.id;
  let idDocument = new mongo.ObjectId(idChose);

  //findOneandUpdate (doument_a_update , champs_updaté+valeur,callback)
  db.collection("choses").findOneAndUpdate({_id:idDocument}, { $set : { contenu: nouveauContenu } }, () => {
    res.send('Element mis à jour');
   });
});

serveur.post ("/supprimer", (req,res) => {

  const idChose = req.body.id;
  let idDocument = new mongo.ObjectId(idChose);

 db.collection("choses").deleteOne({_id : idDocument} ,() => {
  res.send('Element supprimé');
});
});

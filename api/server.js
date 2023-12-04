const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://leo:mongodb@cluster0.a2jnaff.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("connected"))
.catch(console.error);


const User = require('./models/user');




app.post('/user', async (req, res) => {
    try {
        const { email, pass } = req.body;
        const hashedPassword = await bcrypt.hash(pass, 10);
        
        console.log('Data from the form:', { email, pass });

        const nouvelUtilisateur = new User({ email, pass: hashedPassword });
        console.log('New user object:', nouvelUtilisateur);

        const utilisateurSauvegarde = await nouvelUtilisateur.save();
        console.log('User saved:', utilisateurSauvegarde);

        res.json(utilisateurSauvegarde);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
});


const jwt = require('jsonwebtoken');
// Connexion de l'utilisateur
app.post('/login', async (req, res) => {
    const { email, pass } = req.body;
  
    try {
      // Trouver l'utilisateur dans la base de données par email
      const utilisateur = await User.findOne({ email });
  
      // Vérifier si l'utilisateur existe et si le mot de passe est correct
      if (utilisateur && (await bcrypt.compare(pass, utilisateur.pass))) {
        // Créer un token avec l'email de l'utilisateur
        const token = jwt.sign({ email }, 'zumba', { expiresIn: '1h' });
  
        res.json({ token });
      } else {
        // Échec de la connexion
        res.status(401).json({ message: 'Identifiants incorrects' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur interne du serveur');
    }
  });


  app.get('/compte', async (req, res) => {
    try {
      const users = await User.find({}); // Récupère seulement les champs 'email'
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur interne du serveur');
    }
  });


  app.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Déconnexion réussie' });
  });
app.listen(3001,() => console.log("server started on 3001"));
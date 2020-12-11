const express = require('express');
const server = express();

//pegar o banco de dados 
const db = require('./database/db');

//Configurando arquivos estaticos 
server.use(express.static("public"));

//Habilitar req.body
server.use(express.urlencoded({extended:true}));

// Configurando Template Engine(Nunjucks)
const nunjuck = require("nunjucks");
nunjuck.configure("src/views", {
    express: server,
    noCache: true,
});

// Configurando caminhos da minha app
// Página Inicial
// req: Requisicao
// res: Resposta

server.get("/", (req, res) => {
    return res.render("index.html");
});

server.get("/create-point", (req, res) => {
    // req.query: Query Strings da nossa url
    // console.log(req.query)
    return res.render("create-point.html");
});

server.post("/savepoint",(req,res) => {
    // req.body: O corpo  da nossa requisicao(form)
    // console.log(req.query)
    console.log(req.body);
    //Inserir dados no banco de dados
     const query = `
    INSERT INTO places (
        image,
        name,
        adress,
        adress2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);`

    const values = [
       req.body.image,
       req.body.name,
       req.body.adress,
       req.body.adress2,
       req.body.state,
       req.body.city,
       req.body.items
    ];

    function afterInsertData(err) {
        if (err) {
            return console.log(err)
        }

        console.log("Cadastrado com sucesoo");
        console.log(this);

        return res.render("create-point.html",{saved:true});

    }

    db.run(query,values, afterInsertData);
});

server.get("/search", (req, res) => {

        const search = req.query.search;

        if(search == ""){
            //pesquisa vazia
            return  res.render("search-results.html",{total:0});
        }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err);
        }
        console.log("Aqui estão seus registros");
        console.log(rows);
        const total = rows.length;
        //Mostrar a page html com os dados do banco de dados
        return res.render("search-results.html",{places:rows , total });
    });
});

// Ligando server
server.listen(3000);
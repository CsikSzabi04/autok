import express from 'express';
import cors from 'cors';
import fs from 'fs';

let autok = [];
let nextId = 0;

fs.readFile("autok.csv", "utf-8", (error, data) =>{
    if(error) console.log(error);
    else{
        let sorok = data.split("\r\n");
        for(let sor of sorok){
            let s = sor.split(";");
            autok.push({id:s[0]*1, tipus:s[1], suly:s[2]*1, loero:s[3]*1});
        }
        for(let a of autok) if (a.id > nextId) nextId = a.id;
        console.log("Beolvasott autok száma: " + autok.lenght + " (nextId: " + nextId + " ) ");
    } 
});

const app = express();
app.use(express.json());
app.use(cors());

function addAuto(req, res){
    if(req.body.tipus && req.body.suly &&req.body.loero){
        autok.push({id:nextId++, tipus:req.body.tipus, suly:req.body.suly*1, loero:req.body.loero*1});
        res.send();
    }else res.send({error: "Hiányzó paraméterek!"});
}

function modAuto(req, res){
    if(req.body.id && req.body.tipus && req.body.suly && req.body.loero){
        let i = indexOf(req.body.id*1);
        if(i != -1){
            const auto = {id:req.body.id*1, tipus:req.body.tipus, suly:req.body.suly, loero:req.body.loero}
            autok[i] = auto;
            res.send(auto);
        } else res.send({error:"Hibás azonosító!"});
    }else res.send({error:"Hiányzó paraméterek!"});
}

function delAuto(req, resp){
    if(req.body.id){
        let i = indexOf(req.body.id);
        if(i!=-1){
            const auto = autok.splice(i, 1);
            resp.send( auto[0] );
        } else resp.send( { error: 'Nincs ilyen ID!' } );
    } else resp.send( { error: 'Hibás paraméter!' } );
}

function indexOf(id){
    let i = 0; while (i < autok.length && autok[i].id != id) i++;
    if(i < autok.length) return i; else return -1;
}

app.get("/", (req, res) => res.send("<h1>Autók v1.0.0</h1>"));
app.get("/autok", (req, res) => res.send(autok));
app.post("/auto", addAuto);
app.put("/auto", modAuto);
app.delete("/auto", delAuto);

app.listen(88, (error) => {
    if(error) console.log(error); else console.log("Server on 88");
});
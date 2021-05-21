const express = require('express');
const app = new express();
const cors = require('cors');

const MongoClient = require("mongodb").MongoClient;
// const DB_URI = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
//const DB_URI = "mongodb+srv://eliel:12345@cluster0.xm3ru.mongodb.net/so1?retryWrites=true&w=majority"

const DB_URI ="mongodb://mongo:27017/so1"
app.use(cors())

var db;
MongoClient.connect(DB_URI, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db("so1");
});
  

app.use(express.json({ limit: '5mb', extended: true }));


// Insertar infectado
app.post('/postInfectado', async (req, res) => {
    const data = req.body;
    try {
        let collection = db.collection("datacovid");
        let result = await collection.insertOne(data);
        res.json(result.ops[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});

// Registro de todas las personas
/*app.get('/mensajes', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        let result = await collection.find().sort({_id:1}).toArray();
        res.status(200).json(result);

    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});*/


// Region mas infectada;  una región es una agrupación de departamentos
app.get('/masInfectada', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        let num_metro = await collection.find({location:"Guatemala"}).count();
        let num_central = await collection.find({ $or: [{location:"Chimaltenango"},{location:"Sacatepéquez"},{location:"Escuintla"}]}).count();
        let num_verapaz = await collection.find({ $or: [{location:"Alta Verapaz"},{location:"Baja Verapaz"}]}).count();
        let num_nororiente = await collection.find({ $or: [{location:"Chiquimula"},{location:"El Progreso"},{location:"Izabal"},{location:"Zacapa"}]}).count();
        let num_suroriente = await collection.find({ $or: [{location:"Jutiapa"},{location:"Jalapa"},{location:"Santa Rosa"}]}).count();
        let num_peten = await collection.find({location:"Petén"}).count();
        let num_suroccidente = await collection.find({ $or: [{location:"Quetzaltenango"},{location:"Retalhuleu"},{location:"San Marcos"},{location:"Suchitepéquez"},{location:"Sololá"},{location:"Totonicapán"}]}).count();
        let num_noroccidente = await collection.find({ $or: [{location:"Huehuetenango"},{location:"Quiché"}]}).count();

        let max = Math.max(num_central,num_metro,num_verapaz,num_nororiente,num_suroriente,num_peten,num_suroccidente,num_noroccidente);
        if(num_metro == max){
            res.status(200).json({region:"Metropolitana",contador:num_metro});
        }else if(num_central == max){
            res.status(200).json({region:"Central",contador:num_central});
        }else if(num_verapaz == max){
            res.status(200).json({region:"Verapaz",contador:num_verapaz});
        }else if(num_nororiente == max){
            res.status(200).json({region:"Nororiente",contador:num_nororiente});
        }else if(num_suroriente == max){
            res.status(200).json({region:"Suroriente",contador:num_suroriente});
        }else if(num_peten == max){
            res.status(200).json({region:"Peten",contador:num_peten});
        }else if(num_suroccidente == max){
            res.status(200).json({region:"Suroccidente",contador:num_suroccidente});
        }else if(num_noroccidente == max){
            res.status(200).json({region:"Noroccidente",contador:num_noroccidente});
        }
        

    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});


// Top 5 departamentos mas afectados
app.get('/deptMasInfec', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        let result = await collection.aggregate([{$group: {_id:"$location",contador: {$sum:1}}},{$sort:{contador:-1}}]).limit(5).toArray()
        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});


// porcentaje de casos infectados por state.
app.get('/InfectadosPorEstado', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        let totalinfectados = await collection.find().count();

        let result = await collection.aggregate([
            { "$group": { "_id": "$state", "count": { "$sum": 1 }}},    
            { "$project": { 
            "count": 1, 
            "porcentaje": { 
                "$concat": [ { "$substr": [ { "$multiply": [ { "$divide": [ "$count", {"$literal": totalinfectados }] }, 100 ] }, 0,3 ] }, "", "%" ]}
            }
        }
            
        ]).toArray()
       
        res.status(200).json(result);
     
    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});


// porcentaje de casos infectados por infectedType.
app.get('/InfectedType', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        let totalinfectados = await collection.find().count();

        let result = await collection.aggregate([
            { "$group": { "_id": "$infectedtype", "count": { "$sum": 1 }}},    
            { "$project": { 
            "count": 1, 
            "porcentaje": { 
                "$concat": [ { "$substr": [ { "$multiply": [ { "$divide": [ "$count", {"$literal": totalinfectados }] }, 100 ] }, 0,3 ] }, "", "%" ]}
            }
        }
            
        ]).toArray()
        
        res.status(200).json(result);

    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});

// Ultimos 5 casos registrados
app.get('/ultimosCasosRegistrados', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        let result = await collection.find().limit(5).sort({_id:-1}).toArray();
        console.log(result)
        res.status(200).json(result);

    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});

//Rango de edad de infectados (rangos de 10 años, por ejemplo 0..9, 10..19, etc).
app.get('/edadesInfectados', async (req, res) => {
    try{
        let collection = db.collection("datacovid")
        let edad0_9 = await collection.find({ $or: [{age:0},{age:1},{age:2},{age:3},{age:4},{age:5},{age:6},{age:7},{age:8},{age:9},]}).count();
        let edad10_19 = await collection.find({ $or: [{age:10},{age:11},{age:12},{age:13},{age:14},{age:15},{age:16},{age:17},{age:18},{age:19},]}).count();
        let edad20_29 = await collection.find({ $or: [{age:20},{age:21},{age:22},{age:23},{age:24},{age:25},{age:26},{age:27},{age:28},{age:29},]}).count();
        let edad30_39 = await collection.find({ $or: [{age:30},{age:31},{age:32},{age:33},{age:34},{age:35},{age:36},{age:37},{age:38},{age:39},]}).count();
        let edad40_49 = await collection.find({ $or: [{age:40},{age:41},{age:42},{age:43},{age:44},{age:45},{age:46},{age:47},{age:48},{age:49},]}).count();
        let edad50_59 = await collection.find({ $or: [{age:50},{age:51},{age:52},{age:53},{age:54},{age:55},{age:56},{age:57},{age:58},{age:59},]}).count();
        let edad60_69 = await collection.find({ $or: [{age:60},{age:61},{age:62},{age:63},{age:64},{age:65},{age:66},{age:67},{age:68},{age:69},]}).count();
        let edad70_79 = await collection.find({ $or: [{age:70},{age:71},{age:72},{age:73},{age:74},{age:75},{age:76},{age:77},{age:78},{age:79},]}).count();
        let edad80_89 = await collection.find({ $or: [{age:80},{age:81},{age:82},{age:83},{age:84},{age:85},{age:86},{age:87},{age:88},{age:89},]}).count();
        let edad90_99 = await collection.find({ $or: [{age:90},{age:91},{age:92},{age:93},{age:94},{age:95},{age:96},{age:97},{age:98},{age:99},]}).count();
        res.status(200).json([{rango:"0-9",contador:edad0_9},{rango:"10-19",contador:edad10_19},{rango:"20-29",contador:edad20_29},{rango:"30-39",contador:edad30_39},
        {rango:"40-49",contador:edad40_49},{rango:"50-59",contador:edad50_59},{rango:"60-69",contador:edad60_69},{rango:"70-79",contador:edad70_79},
        {rango:"80-89",contador:edad80_89},{rango:"90-99",contador:edad90_99}]);
    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});


//Consultas Proyecto 2
//Datos almacenados en la base de datos en MongoDB
app.get('/mensajes', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        let result = await collection.find().sort({_id:1}).toArray();
        res.status(200).json(result);

    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});

//Los diez países con más vacunados, en Redis.

//Personas vacunadas por cada país, en Redis.

//Gráfica de pie de los géneros de los vacunados por país, en MongoDB.
app.get('/Generos_VacunadosPorPais', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        
       let result = await collection.aggregate([
            { "$group": { 
                "_id":{pais: "$location", genero:"$gender" }, 
                "cantidad": { "$sum": 1 }
              }
            },  
            
            
            
            /*{ "$group":{ "_id":"$location"}},
            { "$project":{
                "femenino": {
                    "$match":{
                        gender:"female"
                    }
                            
                    }

                }
            }
            */
        ]).toArray()

       

        
        
        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});


//Los últimos cinco vacunados almacenados por país, en MongoDB.
app.get('/ultimos_vacunados_pais', async (req, res) => {
    try{
        let collection = db.collection("datacovid");
        let result = await collection.aggregate([
            
            { "$group":
                {
                    _id: "$location",
                    ultimos_vacunados: {$push:{ nombre: "$name"}} 
                }
            },
            { $sort: { ultimos_vacunados: -1 } },
            {
                $limit: 5
            }
           
        ]).toArray();
        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});

//Gráfica de barras del rango de edades (de diez en diez) por cada país, en Redis.



app.listen(4000);

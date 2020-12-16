const { FACT_Mantencion,sequelize } = require("../database/databaseDM");
const { trucatedecimal, validExist, validateTypes } = require("./Helpers");

//Get List Users
const ListDMMantencionesDisponibilidad = async(req,res)=>{
    try {
        // const DM_Mantencion = await FACT_Mantencion.findAll({
        //     attributes: ['Id_falla','Id_tiempo','Id_evento','Id_tipo','Id_componente','Hrs_programadas','Hrs_noProgramadas','Disponibilidad','MTTR','MTBF','MTBME','CantEventos_programados','CantEventos_noProgramados','HrsTotales_mantencion'],
        //     include:{
        //         model: DIM_Tiempo,
        //         attributes: ['Mes']      
        //     }
        // });
        const DM_Mantencion = await sequelize.query("SELECT DIM_Tiempo.Fecha,DIM_Tiempo.Id_tiempo, FACT_Mantencion.Disponibilidad FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE DIM_Tiempo.NombreMes = N'Enero'");
        await FACT_Mantencion.count().then(c=>{console.log("Hay "+c+" Registros")});
        console.log("DMMantenciones");
        res.json({success:DM_Mantencion});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
const ListTiposMantencion = async(req,res)=>{
    var Time = parseInt(typeof req.params.year === "string" ? req.params.year : "1");
    var CampofechaDB = "";
    if (!Number.isInteger(Time)) {
        console.log("El Fecha no es valido");
        return res.status(500),json({
           message:"Ingrese una Fecha valido",
           data:{}
       }) 
    }if (Time>12) {
        CampofechaDB = "Año";
    }else{
        CampofechaDB = "Mes";
    }
    try {
        const DM_MantencionTipo1 = await sequelize.query("SELECT SUM(HrsTotales_mantencion) AS 'Mecanica' FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE Id_tipo = 1 AND "+CampofechaDB+" = "+Time);
        const DM_MantencionTipo2 = await sequelize.query("SELECT SUM(HrsTotales_mantencion) AS 'Electrica' FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE Id_tipo = 2 AND "+CampofechaDB+" = "+Time);
        const val = {
            Mecanica: DM_MantencionTipo1[0][0].Mecanica ? DM_MantencionTipo1[0][0].Mecanica : 0 ,
            Electrica: DM_MantencionTipo2[0][0].Electrica ? DM_MantencionTipo2[0][0].Electrica : 0 ,
            Total: (DM_MantencionTipo1[0][0].Mecanica+DM_MantencionTipo1[0][0].Mecanica > 0 ? DM_MantencionTipo1[0][0].Mecanica+DM_MantencionTipo2[0][0].Electrica : 0)
        }
        //console.log(val);
        res.json(val);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
const ListComponentesMantencion = async(req,res)=>{
    var Time = parseInt(typeof req.params.year === "string" ? req.params.year : "1");
    var CampofechaDB = "";
    if (!Number.isInteger(Time)) {
        console.log("El Fecha no es valido");
        return res.status(500),json({
           message:"Ingrese una Fecha valido",
           data:{}
       }) 
    }if (Time>12) {
        CampofechaDB = "Año";
    }else{
        CampofechaDB = "Mes";
    }
    try {
        const DM_MantencionComponente1 = await sequelize.query("SELECT SUM(HrsTotales_mantencion) AS 'Comp1',SUM(Hrs_programadas) AS 'Programadas',SUM(Hrs_noProgramadas) AS 'NoProgramadas' FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE Id_componente = 1 AND "+CampofechaDB+" = "+Time);
        const DM_MantencionComponente2 = await sequelize.query("SELECT SUM(HrsTotales_mantencion) AS 'Comp2',SUM(Hrs_programadas) AS 'Programadas',SUM(Hrs_noProgramadas) AS 'NoProgramadas' FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE Id_componente = 2 AND "+CampofechaDB+" = "+Time);
        const DM_MantencionComponente3 = await sequelize.query("SELECT SUM(HrsTotales_mantencion) AS 'Comp3',SUM(Hrs_programadas) AS 'Programadas',SUM(Hrs_noProgramadas) AS 'NoProgramadas' FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE Id_componente = 3 AND "+CampofechaDB+" = "+Time);
        const DM_MantencionComponente4 = await sequelize.query("SELECT SUM(HrsTotales_mantencion) AS 'Comp4',SUM(Hrs_programadas) AS 'Programadas',SUM(Hrs_noProgramadas) AS 'NoProgramadas' FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE Id_componente = 4 AND "+CampofechaDB+" = "+Time);
        const val1 = [Math.round(DM_MantencionComponente1[0][0].Comp1),Math.round(DM_MantencionComponente1[0][0].Programadas),Math.round(DM_MantencionComponente1[0][0].NoProgramadas)];
        const val2 = [Math.round(DM_MantencionComponente2[0][0].Comp2),Math.round(DM_MantencionComponente2[0][0].Programadas),Math.round(DM_MantencionComponente2[0][0].NoProgramadas)];
        const val3 = [Math.round(DM_MantencionComponente3[0][0].Comp3),Math.round(DM_MantencionComponente3[0][0].Programadas),Math.round(DM_MantencionComponente3[0][0].NoProgramadas)];
        const val4 = [Math.round(DM_MantencionComponente4[0][0].Comp4),Math.round(DM_MantencionComponente4[0][0].Programadas),Math.round(DM_MantencionComponente4[0][0].NoProgramadas)];
        const val = {
            'Comp1': val1[0] ? val1 : 0 ,
            'Comp2': val2[0] ? val2 : 0 ,
            'Comp3': val3[0] ? val3 : 0 ,
            'Comp4': val4[0] ? val4 : 0 ,
            Total: (val1[0]+val2[0]+val3[0]+val4[0] > 0 ? val1[0]+val2[0]+val3[0]+val4[0] : 0)
        }
        console.log(val);
        res.json(val);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

const ListEventoMantencion = async(req,res)=>{
    var Time = parseInt(typeof req.params.year === "string" ? req.params.year : "1");
    var CampofechaDB = "";
    if (!Number.isInteger(Time)) {
        console.log("El Fecha no es valido");
        return res.status(500),json({
           message:"Ingrese una Fecha valido",
           data:{}
       }) 
    }if (Time>12) {
        CampofechaDB = "Año";
    }else{
        CampofechaDB = "Mes";
    }
    try {
        const DM_MantencioEvento = await sequelize.query("SELECT SUM(HrsTotales_mantencion) AS 'Totales',SUM(Hrs_programadas) AS 'Programadas',SUM(Hrs_noProgramadas) AS 'NoProgramadas' FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE "+CampofechaDB+" = "+Time);
        DM_MantencioEvento[0][0].Totales = DM_MantencioEvento[0][0].Totales ? trucatedecimal(DM_MantencioEvento[0][0].Totales,2) : 0;
        DM_MantencioEvento[0][0].Programadas = DM_MantencioEvento[0][0].Programadas ? trucatedecimal(DM_MantencioEvento[0][0].Programadas,2) : 0;
        DM_MantencioEvento[0][0].NoProgramadas = DM_MantencioEvento[0][0].NoProgramadas ? trucatedecimal(DM_MantencioEvento[0][0].NoProgramadas,2) : 0
        // console.log(DM_MantencioEvento[0][0].Programadas);
        res.json(DM_MantencioEvento);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

const ListDisponibilidadAnual = async(req,res)=>{
    const errors = []
    let condicion1 ="",condicion2="";
    //VALIDACIÓN DE PARAMETROS AÑO EQUIPO
    if (req.params.year.length === 4 && req.params.year > 1900 && req.params.equipo) {
        console.log("parametros");
        const maquinariaResult = await validExist("maquinaria",req.params.equipo,"Nombre_maquinaria","NOTEXIST");
        const yearResult = await validateTypes(req.params.year,"number");
        maquinariaResult != null && errors.push(maquinariaResult);
        yearResult != null && errors.push(yearResult);
        if (errors.length>0) {
            return res.status(422).json({errors});
        }else{
            condicion1=` AND Nombre_maquinaria = '${req.params.equipo}' AND Anio = '${req.params.year}'`;
            condicion2=` Where Equipo = '${req.params.equipo}' AND Año = '${req.params.year}'`;
        }
    }else{
        return res.status(422).json({errors:"Ha ocurrido un error, Revise los parametros"});
    }
    try {
        //PETICIONES SQL
        const DM_MantencionDisponibilidad = await sequelize.query("SELECT AVG(Disponibilidad) as 'Disponiblidad_Anual', AVG(MTTR) as 'MTTR', AVG(MTBF) as 'MTBF',AVG(MTBME) as 'MTBME' FROM view_DMDisponibilidadCandelaria"+condicion2)
        .then(res => res[0][0]);
        const MetasDisponibilidad = await sequelize.query("SELECT * FROM Mantencion_chancador.dbo.Programa_Mantencion pm,mantencion_chancador.dbo.Maquinaria mq WHERE mq.Id_maquinaria = pm.Id_maquinaria"+condicion1)
        .then(res => res[0]);

        console.log(MetasDisponibilidad)
        if (DM_MantencionDisponibilidad && MetasDisponibilidad.length>0) {
            //JOIN METAS & DATA
            for (let i = 0; i < MetasDisponibilidad.length; i++) {
                
            }
            DM_MantencionDisponibilidad.Disponibilidad_Metas = MetasDisponibilidad[0].Meta;
            DM_MantencionDisponibilidad.MTTR_Metas = MetasDisponibilidad[1].Meta;
            DM_MantencionDisponibilidad.MTBF_Metas = MetasDisponibilidad[2].Meta;
            DM_MantencionDisponibilidad.MTBME_Metas = MetasDisponibilidad[3].Meta;
            
            res.json(DM_MantencionDisponibilidad);   
            
        }else{
            return res.status(422).json({errors:"No existen Datos"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

const ListMTTR = async(req,res)=>{
    let meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    let dispmeses = [];

    var yearTime = parseInt(typeof req.params.year === "string" ? req.params.year : "1");
    if (!Number.isInteger(yearTime)) {
        console.log("El Año no es valido");
        return res.status(500),json({
           message:"Ingrese un año valido",
           data:{}
       }) 
    }
    try {
        const DM_MantencionMTTR = await sequelize.query("SELECT DIM_Tiempo.NombreMes,DIM_Tiempo.Id_tiempo, FACT_Mantencion.MTTR FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE  Año = "+yearTime)
        .then(res => res[0])
        
        meses.forEach(element => {
            var sum = 0
            var index = 0;
            DM_MantencionMTTR.forEach(val => {
                if (element===val.NombreMes) {
                    sum += val.MTTR;   
                    index++;              
                }
            });
            //console.log(trucatedecimal((sum/index),2));
            dispmeses.push(trucatedecimal((sum/index),2));
        });
        for (let i = 0; i < meses.length; i++) {
            
           // console.log(meses[i]+" " +dispmeses[i])
        }
        res.json(dispmeses);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

const ListMTBF = async(req,res)=>{
    let meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    let dispmeses = [];

    var yearTime = parseInt(typeof req.params.year === "string" ? req.params.year : "1");
    if (!Number.isInteger(yearTime)) {
        console.log("El Año no es valido");
        return res.status(500),json({
           message:"Ingrese un año valido",
           data:{}
       }) 
    }
    try {
        const DM_MantencionMTBF = await sequelize.query("SELECT DIM_Tiempo.NombreMes,DIM_Tiempo.Id_tiempo, FACT_Mantencion.MTBF FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE Año = "+yearTime)
        .then(res => res[0])
        
        meses.forEach(element => {
            var sum = 0
            var index = 0;
            DM_MantencionMTBF.forEach(val => {
                if (element===val.NombreMes) {
                    sum += val.MTBF;   
                    index++;              
                }
            });
            //console.log(trucatedecimal((sum/index),2));
            dispmeses.push(trucatedecimal((sum/index),2));
        });
        for (let i = 0; i < meses.length; i++) {
            
            //console.log(meses[i]+" " +dispmeses[i])
        }
        res.json(dispmeses);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
const ListMTBME = async(req,res)=>{
    let meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    let dispmeses = [];

    var yearTime = parseInt(typeof req.params.year === "string" ? req.params.year : "1");
    if (!Number.isInteger(yearTime)) {
        console.log("El Año no es valido");
        return res.status(500),json({
           message:"Ingrese un año valido",
           data:{}
       }) 
    }
    try {
        const DM_MantencionMTBME = await sequelize.query("SELECT DIM_Tiempo.NombreMes,DIM_Tiempo.Id_tiempo, FACT_Mantencion.MTBME FROM [MantencionDatamart].[dbo].[FACT_Mantencion] INNER JOIN DIM_Tiempo ON[FACT_Mantencion].Id_tiempo = DIM_Tiempo.Id_tiempo WHERE Año = "+yearTime)
        .then(res => res[0])
        
        meses.forEach(element => {
            var sum = 0
            var index = 0;
            DM_MantencionMTBME.forEach(val => {
                if (element===val.NombreMes) {
                    sum += val.MTBME;   
                    index++;              
                }
            });
            //console.log(trucatedecimal((sum/index),2));
            dispmeses.push(trucatedecimal((sum/index),2));
        });
        for (let i = 0; i < meses.length; i++) {
            
            //console.log(meses[i]+" " +dispmeses[i])
        }
        res.json(dispmeses);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

//********************************************************
// ******************************************* */

const LISTAVIEWDETENCIONES = async(req,res)=>{
    try {
        const DM_Mantencion = await sequelize.query("select * from view_DMDetencionCandelaria");
        // await FACT_Mantencion.count().then(c=>{console.log("Hay "+c+" Registros")});
        // console.log("DM_Mantencion");
        const pivotDates = DM_Mantencion[0]
        res.json({pivotDates});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
        message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
const LISTAVIEWDISPONIBILIDAD = async(req,res)=>{
    try {
        const DM_Mantencion = await sequelize.query("select * from view_DMDisponibilidadCandelaria");
        // await FACT_Mantencion.count().then(c=>{console.log("Hay "+c+" Registros")});
        // console.log(DM_Mantencion);
        const pivotDates = DM_Mantencion[0]
        res.json({pivotDates});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

module.exports = {
    ListDMMantencionesDisponibilidad,
    ListTiposMantencion,
    ListComponentesMantencion,
    ListEventoMantencion,
    ListDisponibilidadAnual,
    ListMTTR,
    ListMTBF,
    ListMTBME,
    LISTAVIEWDETENCIONES,
    LISTAVIEWDISPONIBILIDAD
};
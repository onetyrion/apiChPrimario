const { sequelize } = require("../database/databaseDM");
const { validExist, validateTypes } = require("./Helpers");

//********************************************************
// ******************************************* */

const ListDisponibilidadAnual = async(req,res)=>{
    const errors = []
    let condicion1 ="",condicion2="";
    //VALIDACIÓN DE PARAMETROS AÑO EQUIPO
    if (req.params.year.length === 4 && req.params.year > 1900 && req.params.equipo) {
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

        // console.log(MetasDisponibilidad)
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

/*  PARAMS JOB SHEDULE
    @intjob_name = N'JobDetencionesDM', --JOB NAME TO COMPARE
    @intname=N'Shedule_JobDetencionesDM', -- SHEDULE NAME TO ASSIGN
    @intenabled=1, --1 ENABLE --0 DISABLE
    @intfreq_type=4, --1 once --4 daily --8 weekly -- 16 monthly  --32 Monthly, relative to freq interval --64 Run when SQLServerAgent --128 PC ON
    @intfreq_interval=1, 
    @intfreq_subday_type=1, 
    @intfreq_subday_interval=0, 
    @intfreq_relative_interval=0, 
    @intfreq_recurrence_factor=1, 
    @intactive_start_date=20201217, --YYYYMMDD START OF SHEDULE
    @intactive_end_date=20221231, --YYYYMMDD (this represents no end date)
    @intactive_start_time=145700, --HHMMSS TIME OF EXECUTION OF JOB
    @intactive_end_time=235959; --HHMMSS MAX TIME OF EXECUTION
*/

const ScheduleETL = async(req,res)=>{
    try {
        const {intjob_name, intname, intenabled,intfreq_type,intfreq_interval,intfreq_subday_type,intfreq_subday_interval,intfreq_relative_interval,intfreq_recurrence_factor,intactive_start_date,intactive_end_date,intactive_start_time,intactive_end_time} = req.body
        console.log("BANDERA");
        const ETL = await sequelize.query(
            "EXEC UPDATE_SHEDULEJOB_ETL @intjob_name = :intjob_name, @intname = :intname, @intenabled = :intenabled, @intfreq_type = :intfreq_type, @intfreq_interval = :intfreq_interval, @intfreq_subday_type = :intfreq_subday_type, @intfreq_subday_interval = :intfreq_subday_interval, @intfreq_relative_interval = :intfreq_relative_interval, @intfreq_recurrence_factor = :intfreq_recurrence_factor, @intactive_start_date = :intactive_start_date, @intactive_end_date = :intactive_end_date, @intactive_start_time = :intactive_start_time, @intactive_end_time = :intactive_end_time"
            ,{
                replacements:{ 
                    intjob_name,
                    intname,
                    intenabled,
                    intfreq_type,
                    intfreq_interval,
                    intfreq_subday_type,
                    intfreq_subday_interval,
                    intfreq_relative_interval,
                    intfreq_recurrence_factor,
                    intactive_start_date,
                    intactive_end_date,
                    intactive_start_time,
                    intactive_end_time
                }
                , 'type': sequelize.QueryTypes.SELECT })
            .then((resultValues) => { 
                console.log('resultValues', resultValues); 
                res.json({success:"Se ha programado el evento ETL para las "+intactive_start_time});
            })  
            .catch((error) => { console.log('Error'); res.json({error})});
        if (ETL) {
            console.log(ETL);
            res.json({ETL});
        }

    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error"
       })         
    }
}
const GETSCHEDULEJOB = async(req,res)=>{
    try {
        const ScheduleJob = await sequelize.query("SELECT msdb.dbo.sysjobschedules.next_run_date,msdb.dbo.sysjobschedules.next_run_time ,msdb.dbo.sysschedules.freq_type, msdb.dbo.sysschedules.active_start_date, msdb.dbo.sysschedules.active_end_date, msdb.dbo.sysschedules.active_start_time, msdb.dbo.sysschedules.active_end_time FROM msdb.dbo.sysjobs JOIN msdb.dbo.sysjobschedules ON sysjobs.job_id = sysjobschedules.job_id JOIN msdb.dbo.sysschedules ON sysjobschedules.schedule_id = sysschedules.schedule_id WHERE msdb.dbo.sysjobs.job_id =(SELECT job_id FROM msdb.dbo.sysjobs WHERE (name = 'JobDetencionesDM'))");
        res.json({"ScheduleJob":ScheduleJob[0][0]});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

module.exports = {
    ListDisponibilidadAnual,
    LISTAVIEWDETENCIONES,
    LISTAVIEWDISPONIBILIDAD,
    ScheduleETL,
    GETSCHEDULEJOB
};

const { reporteKPI,maquinaria,kpi } = require("../../database/database");
const { validExist } = require("../Helpers");

//POST Create 
const creatingReporteKPI = async(req,res)=>{
    const { Fecha,Resultado_kpi,Mes,Id_maquinaria,Id_kpi } = req.body;
    try {
 
        const errors = []
        const maquinariaResult = await validExist("maquinaria",Id_maquinaria,"Id_maquinaria");
        const kpiResult = await validExist("kpi",Id_kpi,"Id_kpi");

        maquinariaResult != null ? errors.push(maquinariaResult) : null;
        kpiResult != null ? errors.push(kpiResult) : null;
        
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        let newMantencion = await reporteKPI.create({
            Fecha,
            Resultado_kpi,
            Mes,
            Id_maquinaria,
            Id_kpi
        });
        if (newMantencion) {
            return res.json({
                message:'KPI Report Created Successfully',
                data:newMantencion
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       }) 
    }
}

//Get List 
const ListreporteKPI = async(req,res)=>{
    try {
        const reportekpiList = await reporteKPI.findAll();
        res.json(reportekpiList);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

// PUT UPDATE 
const updateReporteKPI = async(req,res)=>{
    const Id_reportekpi = req.params.Id_reportekpi;
    const { Id_maquinaria,Id_kpi } = req.body;
    //console.log(req)
    try {
        
        const errors = []
        const reporteKPIResult = await validExist("reporteKPI",Id_reportekpi,"Id_reportekpi");
        const maquinariaResult = await validExist("maquinaria",Id_maquinaria,"Id_maquinaria");
        const kpiResult = await validExist("kpi",Id_kpi,"Id_kpi");

        reporteKPIResult != null ? errors.push(reporteKPIResult) : null;
        maquinariaResult != null ? errors.push(maquinariaResult) : null;
        kpiResult != null ? errors.push(kpiResult) : null;
        
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await reporteKPI.update(req.body,{
            where:{ Id_reportekpi: Id_reportekpi}
        });
        console.log("Reporte de KPI Modificado");
        res.json({success:'Se ha modificado'});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//DELETE
const deleteReporteKPI = async(req,res)=>{
    if (Number.isInteger(req.params.Id_reportekpi)) {
        return res.status(422).json({errores : "El reporte no es valido"})
    }
    const Id_reportekpi = req.params.Id_reportekpi;
    try {
        const errors = []
        const reporteKPIResult = await validExist("reporteKPI",Id_reportekpi,"Id_reportekpi");

        reporteKPIResult != null ? errors.push(reporteKPIResult) : null;
        
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await reporteKPI.destroy({
            where:{ Id_reportekpi: Id_reportekpi}
        });
        console.log(`Reporte de KPI Eliminado ${Id_reportekpi}`);
        res.json({success:'Se ha Eliminado'});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
module.exports = {
    creatingReporteKPI,
    updateReporteKPI,
    deleteReporteKPI,
    ListreporteKPI
};
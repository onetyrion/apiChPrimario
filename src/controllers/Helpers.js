//IMPORTS
const { users, login, rol, areaProductiva, usuarioAreaProductiva, mantencion, fallaMantencion, evento, componente, categoria, tipoFalla, falla,	maquinaria,	reporteKPI,	kpi, programaMantencion, tipoMantencion, fallaComponente } = require("../database/database");


const trucatedecimal = (num, digits) => {
    var numS = num.toString(),
    decPos = numS.indexOf('.'),
    substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
    trimmedResult = numS.substr(0, substrLength),
    finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;
    
    return parseFloat(finalResult);
}

const validateTypes = (x,type) => {
    var errors = []
    switch (type) {
        case "string":
            if (!(typeof x === "string")) {
                errors.push({campo:x,error:" Ingrese un texto válido"});
            }
            if (!(x.length <= 255)) {
                errors.push({campo:x,error:" El texto es mayor a 255 caracteres"});
            }
            break;
        case "number":
            if (typeof x !== "number") {
                errors.push({campo:x,error:" Debe ingresar un numero válido"});
            }
            break;
        case "boolean":
            if (x == true || x == false) {
                break;
            }
            errors.push({campo:x,error:" Debe ingresar un parametro válido(Booleano)"});
        default:
                break;
            }
        return errors;
    }

// const tablas = [["users",users], ["login",login], ["rol",rol], ["areaProductiva",areaProductiva], ["usuarioAreaProductiva",usuarioAreaProductiva],[ "mantencion",mantencion], ["fallaMantencion",fallaMantencion], ["evento",evento], ["componente",componente], ["categoria",categoria], ["tipoFalla",tipoFalla], ["falla",falla],	["maquinaria",maquinaria], ["reporteKPI",reporteKPI],	["kpi",kpi], ["programaMantencion",programaMantencion], ["tipoMantencion",tipoMantencion], ["fallaComponente",fallaComponente]]

const validExist = async(tabla,valor,campo) => {
    var item = [];
    item = (tabla === "users") ? await users.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "login") ? await login.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "rol") ? await rol.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "areaProductiva") ? await areaProductiva.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "usuarioAreaProductiva") ? await usuarioAreaProductiva.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "mantencion") ? await mantencion.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "fallaMantencion") ? await fallaMantencion.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "evento") ? await evento.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "componente") ? await componente.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "categoria") ? await categoria.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "tipoFalla") ? await tipoFalla.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "falla") ? await falla.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "maquinaria") ? await maquinaria.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "reporteKPI") ? await reporteKPI.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "kpi") ? await kpi.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "programaMantencion") ? await programaMantencion.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "tipoMantencion") ? await tipoMantencion.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "fallaComponente") ? await fallaComponente.findAll({ where:{ [campo]:valor }}) : [...item];
    
    console.log(tabla+" "+item.length);
    if (item.length === 0 && (tabla !== "login" && tabla !== "fallaMantencion")) {
        return {error : "No está registrado",body:campo};
    }
    if ((tabla === "login" && item.length > 0) || (tabla === "fallaMantencion" && item.length > 0)) { //para no duplicar rut en la DB o llaves foraneas
        return {error : "ya está registrado",body:campo};
    }
    return;
}

module.exports = {
    trucatedecimal,
    validExist
}
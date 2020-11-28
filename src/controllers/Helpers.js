//IMPORTS
const { users, login, rol, areaProductiva, usuarioAreaProductiva, mantencion, fallaMantencion, evento, componente, categoria, tipoFalla, falla,	maquinaria,	reporteKPI,	kpi, programaMantencion, tipoMantencion, fallaComponente, tipoMaquinaria, indicador } = require("../database/database");


const trucatedecimal = (num, digits) => {
    var numS = num.toString(),
    decPos = numS.indexOf('.'),
    substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
    trimmedResult = numS.substr(0, substrLength),
    finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;
    
    return parseFloat(finalResult);
}

const validateTypes = (x,type,cant) => {
    switch (type) {
        case "string":
            if (!(typeof x === "string")) {
                return {campo:x,error:"Ingrese un texto válido"};
            }
            if (!(x.length <= cant)) {
                return {campo:x,error:`El texto es mayor a ${cant} caracteres`};
            }
            break;
        case "number":
            if (!(Number.isInteger(Number(x)))) {
                return{campo:x,error:" Debe ingresar un numero válido"};
            }
            break;
        case "boolean":
            if (x == true || x == false) {
                break;
            }
            return {campo:x,error:" Debe ingresar un parametro válido(Booleano)"};
        default:
                break;
            }
        return;
    }

const validExist = async(tabla,valor,campo,logic) => {
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
    item = (tabla === "Indicador") ? await indicador.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "programaMantencion") ? await programaMantencion.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "tipoMantencion") ? await tipoMantencion.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "fallaComponente") ? await fallaComponente.findAll({ where:{ [campo]:valor }}) : [...item];
    item = (tabla === "tipoMaquinaria") ? await tipoMaquinaria.findAll({ where:{ [campo]:valor }}) : [...item];
    // item = (tabla === "reporteKPI") ? await reporteKPI.findAll({ where:{ [campo]:valor }}) : [...item];
    
    console.log(tabla+" "+item.length);
    if ( logic === "EXIST" && item.length > 0) { //para no duplicar rut en la DB o llaves foraneas
        return {error : "ya está registrado",body:campo};
    }
    if ( logic === "NOTEXIST" && item.length === 0) { //para no duplicar rut en la DB o llaves foraneas
        return {error : "No está registrado",body:campo};
    }
    return;
}
// BY GITHUB/MARTIIXX
const format_rutify = (str)=> {
	let clearRut = typeof str === 'string' ? str.replace(/[^0-9kK]+/g, '').toUpperCase() : '' // limpiamos la variable rut
	if (clearRut.length <= 1) {
		return str
	}
	var result = clearRut.slice(-4, -1) + '-' + clearRut.substr(clearRut.length - 1)
	for (var i = 4; i < clearRut.length; i += 3) {
	result = clearRut.slice(-3 - i, -i) + '.' + result
	}
	str = result
	if (typeof str !== 'string') {
		return str
	}
	return str;
}
module.exports = {
    trucatedecimal,
    validExist,
    validateTypes,
    format_rutify
}
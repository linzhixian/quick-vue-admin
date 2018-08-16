const provinceCity =require("./provinceCity.json")


let pc=[]

for(let one of Object.keys(provinceCity) ) {
	let oneProvince={}
	oneProvince.label=one
	if(provinceCity[one].length>0) {
		oneProvince.city=[]
		for(let c of provinceCity[one]) {
			oneProvince.city.push({label:c})
		}
	}
	
	pc.push(oneProvince)
}
module.exports=[{label:'全部',city:pc}]
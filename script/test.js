
const createElements=(arr) =>{

    const htmlElements=  arr.map (element => `<span>${element}</span>`)
    console.log(htmlElements.join(" "))

}

const syncoms= ['selim', 'dalim', 'alim']

createElements(syncoms)
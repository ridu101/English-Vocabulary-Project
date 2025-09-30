const loadLessons= () =>{
    fetch('https://openapi.programming-hero.com/api/levels/all')
    .then ( res => res.json())// promise of json data
    .then( (json) => displayLesson(json.data))
}
const displayLesson = (lessons) =>{
    // 1. get a container
    // 2. get into every lesson
        // 3. create Element
        // 4. append to parent

     // 1. get a container
        const levelContainer= document.getElementById('level-container')
        levelContainer.innerHTML =""
    // 2. get into every lesson
        for ( let lesson of lessons){

            // 3. create Element
            console.log(lesson)
            const btnDiv= document.createElement('div')

            btnDiv.innerHTML=`
                <button class="btn btn-outline btn-primary"> <i class="fa-solid fa-book-open"></i> Lesson- ${lesson.level_no}</button>
            `
            // 4. append

            levelContainer.append(btnDiv)

        }
    


}
loadLessons()
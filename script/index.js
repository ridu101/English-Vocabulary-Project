const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())// promise of json data
        .then((json) => displayLesson(json.data))
}

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then((data => displayLevelWords(data.data)))

}


const displayLevelWords = (words) => {

    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = ""

    words.forEach(word => {
        console.log(word)

        const wordCard = document.createElement("div")
        wordCard.innerHTML = `
        <p> Cat</p>
        
        `
        wordContainer.append(wordCard)
    })


}

const displayLesson = (lessons) => {
    // 1. get a container
    // 2. get into every lesson
    // 3. create Element
    // 4. append to parent

    // 1. get a container
    const levelContainer = document.getElementById('level-container')
    levelContainer.innerHTML = ""
    // 2. get into every lesson
    for (let lesson of lessons) {

        // 3. create Element
        console.log(lesson)
        const btnDiv = document.createElement('div')

        btnDiv.innerHTML = `
                <button onclick= "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"> <i class="fa-solid fa-book-open"></i> Lesson- ${lesson.level_no}</button>
            `
        // 4. append

        levelContainer.append(btnDiv)

    }



}
loadLessons()
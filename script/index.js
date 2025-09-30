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
        <div class="word-cards bg-white shadow-lg text-center py-10 px-5 space-y-4">
                <h2 class="font-bold text-xl">${word.word}</h2>
                <p class=" font-semibold">Meaning / Pronounciation </p>
                <div class=" font-medium text-[2xl] font-bangla">${word.meaning}/${word.pronunciation} </div>

                <div class="flex justify-between mt-5">
                    <button class="btn bg[#1a91ff1a] hover:bg-[#1a91ff75] " aria-label="Info">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                    <button class="btn bg-[#1a91ff1a] hover:bg-[#1a91ff75]" aria-label="Volume">
                        <i class="fa-solid fa-volume-low"></i>
                    </button>

                </div>


            </div>
        
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
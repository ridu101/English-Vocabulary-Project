// Load all lessons (buttons)
const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then((json) => {
            displayLesson(json.data)
            // show lesson container after loading
            document.getElementById('level-container').classList.remove('hidden')
        })
}

// Load words of a specific lesson
const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then((data => displayLevelWords(data.data)))
}

// Display words (cards)
const displayLevelWords = (words) => {
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = ""   // remove default message or previous content

    // make container grid instead of centered message
    wordContainer.className = "bg-gray-100 p-10 w-11/12 mx-auto my-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"

    words.forEach(word => {
        const wordCard = document.createElement("div")
        wordCard.innerHTML = `
        <div class="word-cards bg-white shadow-lg text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-xl">${word.word}</h2>
            <p class="font-semibold">Meaning / Pronounciation </p>
            <div class="font-medium text-[2xl] font-bangla">${word.meaning} / ${word.pronunciation}</div>

            <div class="flex justify-between mt-5">
                <button class="btn bg-[#1a91ff1a] hover:bg-[#1a91ff75]" aria-label="Info">
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

// Display lessons as buttons
const displayLesson = (lessons) => {
    const levelContainer = document.getElementById('level-container')
    levelContainer.innerHTML = ""

    for (let lesson of lessons) {
        const btnDiv = document.createElement('div')
        btnDiv.innerHTML = `
            <button onclick="loadLevelWord(${lesson.level_no})" 
                    class="btn btn-outline btn-primary">
                <i class="fa-solid fa-book-open"></i> Lesson-${lesson.level_no}
            </button>
        `
        levelContainer.append(btnDiv)
    }
}

// call first load
loadLessons()

// Load all lessons (buttons)
const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then((json) => {
            displayLesson(json.data)       
        })
}
const removeActive =() =>{
    const lessonButtons= document.querySelectorAll(".lesson-btn")
    lessonButtons.forEach( btn => btn.classList.remove("active"));
}
// Load words of a specific lesson
const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then((data => {
            removeActive();
            const clickBtn= document.getElementById(`lesson-btn-${id}`)
            // console.log(clickBtn)
            clickBtn.classList.add("active")
            displayLevelWords(data.data)
        }))
}

// Display words (cards)
const displayLevelWords = (words) => {
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = ""   // remove default message or previous content

    if (words.length == 0) {
         wordContainer.innerHTML = `
         <div class="text-center col-span-full  space-y-4">
                <i class="fa-solid fa-triangle-exclamation text-[60px]"></i>
                <h5 class="font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। !!</h5>
                <h1 class="font-semibold font-bangla text-[35px]">নেক্সট Lesson এ যান</h1>
            </div>
         
            `    
    }
    // make container grid instead of centered message
    wordContainer.className = "bg-gray-100 p-10 w-11/12 mx-auto my-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"

    words.forEach(word => {
        const wordCard = document.createElement("div")
        wordCard.innerHTML = `
        <div class="word-cards bg-white shadow-lg text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-xl">${word.word ? word.word: "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning / Pronounciation </p>
            <div class="font-medium text-[2xl] font-bangla">${word.meaning ?word.meaning: "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation:"Pronunciation পাওয়া যায়নি "}</div>

            <div class="flex justify-between mt-5">
                <button onclick="my_modal_5.showModal()" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ff75]" aria-label="Info">
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
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" 
                    class="btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i> Lesson-${lesson.level_no}
            </button>
        `
        levelContainer.append(btnDiv)
    }
}

// call first load
loadLessons()

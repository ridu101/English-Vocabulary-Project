// ---------- your existing helper functions (unchanged) ----------
const createElements = (arr) => {
    const htmlElements = arr.map(element => `<span class="btn" >${element}</span>`)
    return htmlElements.join(" ")
}

// speak button functionality
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// Load all lessons (buttons)
const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then((json) => {
            displayLesson(json.data)
        })
}

// Display lessons as buttons
const displayLesson = (lessons) => {
    const levelContainer = document.getElementById('level-container')
    levelContainer.innerHTML = ""

    for (let lesson of lessons) {
        // guard
        if (!lesson || !lesson.level_no) continue;
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
const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn")
    lessonButtons.forEach(btn => btn.classList.remove("active"));
}
// Load words of a specific lesson
const loadLevelWord = (id) => {

    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then((data => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            if (clickBtn) clickBtn.classList.add("active")
            displayLevelWords(data.data)
        }))
}

// Display words (cards)
const displayLevelWords = (words) => {
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = ""   // remove default message or previous content

    if (!words || words.length == 0) {
        wordContainer.innerHTML = `
         <div class="text-center col-span-full  space-y-4">
                <i class="fa-solid fa-triangle-exclamation text-[60px]"></i>
                <h5 class="font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। !!</h5>
                <h1 class="font-semibold font-bangla text-[35px]">নেক্সট Lesson এ যান</h1>
            </div>
        `;
        manageSpinner(false);
        return;
    }
    // make container grid instead of centered message
    wordContainer.className = "bg-gray-100 p-10 w-11/12 mx-auto my-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"

    words.forEach(word => {
        const wordCard = document.createElement("div")
        wordCard.innerHTML = `
        <div class="word-cards bg-white shadow-lg text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning / Pronounciation </p>
            <div class="font-medium text-[2xl] font-bangla">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি "}</div>

            <div class="flex justify-between mt-5">
                <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ff75]" aria-label="Info">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button onclick="pronounceWord('${(word.word||"").replace(/'/g,"\\'")}')" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ff75]" aria-label="Volume">
                   <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>
        `
        wordContainer.append(wordCard)
    })

    manageSpinner(false);
}



// word details load sections
const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const response = await fetch(url)
    const details = await response.json();
    displayWordDetails(details.data)
}
// load word display function
const displayWordDetails = (word) => {
    // console.log(word);
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
                    <div>
                    <h2 class="font-bold text-xl">${word.word}<i class="fa-solid fa-microphone-lines font-bold"></i>:${word.pronunciation}</h2>
                    </div>
                    <div>
                        <h1 class="font-bold">Meaning</h1>
                        <p>${word.meaning}</p>
                    </div>
                    <div>
                        <h2 class="font-bold">Example</h2>
                        <p>${word.sentence}</p>
                    </div>
                    <div>
                        <h1 class="font-bold">সমার্থক শব্দ গুলো</h1>
                        <div> ${createElements(word.synonyms || [])}</div>
                    </div>`
    // show modal (dialog)
    const modal = document.getElementById('word_modal');
    if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
    }
}

// manage spin function (unchanged logic but robust)
const manageSpinner = (status) => {
    const spinner = document.getElementById('spinner');
    const spinnerSection = spinner ? spinner.closest('section') : null;
    const wordContainer = document.getElementById('word-container');

    if (status == true) {
        if (spinnerSection) spinnerSection.classList.remove("hidden");
        if (wordContainer) wordContainer.classList.add("hidden");
    } else {
        if (spinnerSection) spinnerSection.classList.add("hidden");
        if (wordContainer) wordContainer.classList.remove("hidden");
    }
}

// ---------- initialization & login/logout wiring (robust) ----------
document.addEventListener('DOMContentLoaded', () => {
    // find core elements; fallback to searching by nearby elements if id missing
    const startBtn = document.getElementById('start-btn');
    const levelContainer = document.getElementById('level-container');
    const wordContainer = document.getElementById('word-container');
    const inputNumber = document.getElementById('inputNumber');
    const inputPassword = document.getElementById('inputPassword');

    // find search container (either an element with id 'search-container' or the section that contains input-search)
    let searchContainer = document.getElementById('search-container');
    if (!searchContainer) {
        const inputSearch = document.getElementById('input-search');
        searchContainer = inputSearch ? inputSearch.closest('section') : null;
    }

    // find spinner section (parent of #spinner)
    const spinner = document.getElementById('spinner');
    const spinnerSection = spinner ? spinner.closest('section') : null;

    // find login section (if you added id 'login-section', great; otherwise use the section that contains inputNumber)
    let loginSection = document.getElementById('login-section');
    if (!loginSection && inputNumber) loginSection = inputNumber.closest('section');

    // find or locate logout button:
    let logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) {
        // try to detect a button that says "logout" (case-insensitive)
        const candidate = Array.from(document.querySelectorAll('button')).find(b => {
            return b.textContent && b.textContent.trim().toLowerCase().includes('logout');
        });
        if (candidate) {
            candidate.id = 'logout-btn'; // give it an id so future queries work
            logoutBtn = candidate;
        }
    }

    // find or create a login error element
    let loginError = document.getElementById('login-error');
    if (!loginError && loginSection) {
        // try to append a small hidden error text inside the login area (non-destructive)
        loginError = document.createElement('p');
        loginError.id = 'login-error';
        loginError.className = 'text-red-500 font-semibold hidden mt-2';
        loginError.textContent = 'Invalid login! Try again.';
        // place it after the login button if possible
        const btn = loginSection.querySelector('button#start-btn') || loginSection.querySelector('button');
        if (btn && btn.parentElement) btn.parentElement.appendChild(loginError);
        else loginSection.appendChild(loginError);
    }

    // ensure initial hidden state (reset UI on page load)
    if (levelContainer) levelContainer.classList.add('hidden');
    if (searchContainer) searchContainer.classList.add('hidden');
    if (wordContainer) wordContainer.classList.add('hidden');
    if (spinnerSection) spinnerSection.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');

    // safe-guard startBtn listener
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault && e.preventDefault();

            // your simple credential check (you can replace with real check later)
            const mobileNumber = 1878710317;
            const pass = 1234;

            const inputNumberValue = inputNumber ? inputNumber.value : '';
            const inputPasswordValue = inputPassword ? inputPassword.value : '';

            const mobileNumberConverted = parseInt(inputNumberValue);
            const inputPasswordConverted = parseInt(inputPasswordValue);

            if (mobileNumberConverted === mobileNumber && inputPasswordConverted === pass) {
                // success -> show lessons, search, logout; hide login
                if (loginSection) loginSection.classList.add('hidden');
                if (levelContainer) levelContainer.classList.remove('hidden');
                if (searchContainer) searchContainer.classList.remove('hidden');
                if (logoutBtn) logoutBtn.classList.remove('hidden');
                if (loginError) loginError.classList.add('hidden');

                // load lessons (once user is logged in)
                loadLessons();
            } else {
                if (loginError) loginError.classList.remove('hidden');
            }
        });
    }

    // logout behavior
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // reset UI to initial state
            if (loginSection) loginSection.classList.remove('hidden');
            if (levelContainer) levelContainer.classList.add('hidden');
            if (searchContainer) searchContainer.classList.add('hidden');
            if (wordContainer) wordContainer.classList.add('hidden');
            if (spinnerSection) spinnerSection.classList.add('hidden');
            logoutBtn.classList.add('hidden');

            // clear inputs
            if (inputNumber) inputNumber.value = "";
            if (inputPassword) inputPassword.value = "";

            // clear lessons and words
            if (levelContainer) levelContainer.innerHTML = "";
            if (wordContainer) wordContainer.innerHTML = `
                <div class="text-center ">
                    <h5 class="font-bangla">আপনি এখনো কোন Lesson Select করেন নি !!</h5>
                    <h1 class="font-semibold font-bangla text-[40px]">একটি Lesson Select করুন।</h1>
                </div>
            `;

            // hide login error if visible
            if (loginError) loginError.classList.add('hidden');

            // close modal if open
            const modal = document.getElementById('word_modal');
            if (modal && typeof modal.close === 'function') {
                try { modal.close(); } catch (err) { /* ignore */ }
            }
        });
    }

    // show word-container when a lesson button is clicked (delegation)
    document.addEventListener('click', (ev) => {
        const btn = ev.target.closest && ev.target.closest('.lesson-btn');
        if (btn) {
            if (wordContainer) wordContainer.classList.remove('hidden');
        }
    });

    // wire your search button (btn-search) safely here (if present in DOM)
    const btnSearch = document.getElementById('btn-search');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const input = document.getElementById("input-search");
            const searchValue = input ? input.value.trim().toLowerCase() : "";
            if (!searchValue) {
                // if empty, you may want to show all or show a message
                return;
            }
            fetch("https://openapi.programming-hero.com/api/words/all")
                .then(res => res.json())
                .then((data) => {
                    const allWords = data.data || [];
                    const filterWords = allWords.filter((w) => (w.word || "").toLowerCase().includes(searchValue));
                    // show the word container so results are visible
                    if (wordContainer) wordContainer.classList.remove('hidden');
                    displayLevelWords(filterWords);
                })
                .catch(err => console.error(err));
        });
    }
}); // end DOMContentLoaded

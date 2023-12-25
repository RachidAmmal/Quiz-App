let countSpan = document.querySelector('.quiz-info .count span')
let categorySpan = document.querySelector('.quiz-info .category span')
let bulletSpanContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector('.quiz-area')
let answersArea = document.querySelector('.annswers-area')
let submitBtn = document.querySelector('.submit-button')
let reload = document.querySelector('.results .reload')
let bullets = document.querySelector('.bullets')
let resultArea = document.querySelector('.resAr')
let countdown = document.querySelector('.countdown')

let newDiv = document.querySelector('.new-div')
let newDivSpan = document.querySelector('.newDivSpan')

let currentIndex = 0
let rightAnswer = 0
let countDownInterval;

function getQuestions() {
   let myRequest = new XMLHttpRequest()
   myRequest.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
         let questionsObject = JSON.parse(this.responseText)
         let questionsCount = questionsObject.length;

         function getNembers(questionsObject) {
            let result = []
            for (let i = 0; i < 13; i++) {
               let random = Math.floor(Math.random() * questionsCount)
               result.push(questionsObject[random])
            }
            return result
         }
         let myArr = getNembers(questionsObject).length
         createBullets(myArr)

         let myNewQesObj = getNembers(questionsObject)
         addQuestionData(myNewQesObj[currentIndex], myArr)

         countDown(440, myArr)

         let num2 = myArr
         submitBtn.onclick = () => {
            num2--
            countSpan.innerHTML = num2
            let theRightAnswer = myNewQesObj[currentIndex][myNewQesObj[currentIndex].answer]
            currentIndex++
            checkAnswer(theRightAnswer, myArr)
            quizArea.innerHTML = ''
            answersArea.innerHTML = ''
            addQuestionData(myNewQesObj[currentIndex], myArr)
            handleBullets()

         }
      }
   }
   myRequest.open("GET", "html_questions.json", true)
   myRequest.send()
}
getQuestions()

function createBullets(num) {
   countSpan.innerHTML = num
   for (let i = 0; i < num; i++) {
      let theBullet = document.createElement('span')
      if (i === 0) {
         theBullet.className = 'on'
      }
      bulletSpanContainer.appendChild(theBullet)
   }
}

function addQuestionData(obj, count) {
   if (currentIndex < count) {
      let questionTitle = document.createElement('h2')
      questionTitle.classList.add('theQues')
      let questionText = document.createTextNode(obj["question"])
      questionTitle.appendChild(questionText)
      quizArea.appendChild(questionTitle)
      for (let i = 1; i < 5; i++) {
         let mainDiv = document.createElement('div')
         mainDiv.className = 'answer'
         let radioInput = document.createElement("input")
         radioInput.type = "radio"
         radioInput.name = "question"
         radioInput.id = `ANSWER-${i}`
         radioInput.dataset.answer = obj[`ANSWER-${i}`]

         let label = document.createElement('label')
         label.htmlFor = `ANSWER-${i}`

         let theLabelTex = document.createTextNode(obj[`ANSWER-${i}`])
         label.appendChild(theLabelTex)
         mainDiv.appendChild(radioInput)
         mainDiv.appendChild(label)
         answersArea.appendChild(mainDiv)
      }
   } else if (currentIndex == count) {
      clearInterval(countDownInterval)
      reload.classList.remove('displaying')
      reload.innerHTML = 'Reload For A New Quiz'
      quizArea.remove()
      answersArea.remove()
      submitBtn.remove()
      bullets.remove()
      newDiv.classList.add('quiz-app')

      let level;
      if (rightAnswer >= 0 && rightAnswer < 4) {
         level = 'Bad'
         newDiv.classList.add('bad')
      } else if (rightAnswer >= 4 && rightAnswer < 7) {
         level = 'Middle'
         newDiv.classList.add('middle')
      } else if (rightAnswer >= 7 && rightAnswer < 10) {
         level = 'Good'
         newDiv.classList.add('good')
      } else if (rightAnswer >= 10 && rightAnswer <= 13) {
         level = 'Perfect'
         newDiv.classList.add('perfect')
      }
      newDivSpan.innerHTML = `You Answered ${rightAnswer} Questions Correctly Out Of ${count}, Your Level Is ${level}`
   }
}

function checkAnswer(aAnswer, count) {
   let answers = document.getElementsByName('question')
   let theChosenAnswer;
   for (let i = 0; i < answers.length; i++) {
      if (answers[i].checked) {
         theChosenAnswer = answers[i].dataset.answer
      }
   }
   if (aAnswer === theChosenAnswer) {
      rightAnswer++;
   } else {
      let theQues = document.querySelector('.theQues')
      let theQues2 = document.querySelector('.theQues2')
      let hr = document.createElement('hr')

      let spn = document.createElement('span')
      spn.classList.add('corrSpn')
      spn.innerHTML = aAnswer

      theQues2.appendChild(theQues)
      theQues2.appendChild(spn)
      theQues2.appendChild(hr)
   }

}

function handleBullets() {
   let bulletSpans = document.querySelectorAll('.bullets .spans span')
   let arrayOfSpans = Array.from(bulletSpans)
   arrayOfSpans.forEach((span, index) => {
      if (currentIndex === index) {
         span.className = 'on'
      }
   })
}

function countDown(duration, count) {
   if (currentIndex < count) {
      let minutes, seconds;
      countDownInterval = setInterval(function () {
         minutes = parseInt(duration / 60)
         seconds = parseInt(duration % 60)
         minutes = minutes < 10 ? `0${minutes}` : minutes;
         seconds = seconds < 10 ? `0${seconds}` : seconds;
         countdown.innerHTML = `${minutes} : ${seconds}`
         if (--duration < 0) {
            clearInterval(countDownInterval)
            reload.classList.remove('displaying')
            reload.innerHTML = 'Reload For A New Quiz'
            quizArea.remove()
            answersArea.remove()
            submitBtn.remove()
            bullets.remove()
            newDiv.classList.add('quiz-app')

            let level;
            if (rightAnswer >= 0 && rightAnswer < 4) {
               level = 'Bad'
               newDiv.classList.add('bad')
            } else if (rightAnswer >= 4 && rightAnswer < 7) {
               level = 'Middle'
               newDiv.classList.add('middle')
            } else if (rightAnswer >= 7 && rightAnswer < 10) {
               level = 'Good'
               newDiv.classList.add('good')
            } else if (rightAnswer >= 10 && rightAnswer <= 13) {
               level = 'Perfect'
               newDiv.classList.add('perfect')
            }
            newDivSpan.innerHTML = `You Answered ${rightAnswer} Questions Correctly Out Of ${count} Your Level Is ${level}`
         }
      }, 1000)
   }
}

reload.addEventListener('click', () => {
   window.location.reload()
})
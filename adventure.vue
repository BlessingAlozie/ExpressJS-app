<template>
  <div class="min-h-screen bg-[#FFFBF0] pb-24 flex items-center justify-center relative">
    <!-- Splash Screen -->
    <Transition name="fade">
      <div
        v-if="isSplashVisible"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-white"
      >
        <img
          src="/kidsclubzonelogo.webp"
          alt="Kidsclubzone Logo"
          class="h-16 w-auto md:h-20"
          draggable="false"
        />
      </div>
    </Transition>
    <!-- Gender selection (first step after splash) -->
    <section
      v-if="!isSplashVisible && selectedGender === null"
      class="w-full px-4 md:px-12"
    >
      <div class="max-w-2xl mx-auto">
        <div class="bg-white border-4 border-black rounded-[2rem] p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] min-h-[50vh] flex flex-col justify-center">
          <p class="text-center text-lg md:text-xl font-bold text-gray-800 mb-6">
            I am a
          </p>
          <div class="grid grid-cols-2 gap-4 md:gap-6">
            <button
              type="button"
              class="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 md:p-8"
              @click="selectGender('boy')"
            >
              <div class="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                Image
              </div>
              <span class="text-lg md:text-xl font-black text-gray-900">Boy</span>
            </button>
            <button
              type="button"
              class="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 md:p-8 "
              @click="selectGender('girl')"
            >
              <div class="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                Image
              </div>
              <span class="text-lg md:text-xl font-black text-gray-900">Girl</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Quiz (questions) -->
    <section
      v-if="!isSplashVisible && selectedGender !== null && !showResultModal"
      class="w-full px-4 md:px-12"
    >
      <div class="max-w-4xl md:max-w-5xl mx-auto space-y-8">
        <!-- Progress + controls -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="space-y-2">
            <p class="text-xs font-semibold tracking-[0.18em] uppercase text-gray-600">
              Question {{ currentIndex + 1 }} of {{ totalQuestions }}
            </p>
            <div class="w-full h-2 bg-white border-2 border-black rounded-full overflow-hidden">
              <div
                class="h-full bg-[#FF6B6B] transition-all duration-300"
                :style="{ width: totalQuestions ? ((currentIndex + 1) / totalQuestions) * 100 + '%' : '0%' }"
              ></div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-bold rounded-xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform"
              @click="restart"
            >
              Start Over
            </button>
          </div>
        </div>

        <!-- Current question slide -->
        <Transition name="slide-fade" mode="out-in">
          <div v-if="currentQuestion" :key="currentQuestion.id">
            <QuizSection
              :label="currentQuestion.sectionLabel"
              :title="currentQuestion.sectionTitle"
              :description="currentQuestion.sectionDescription"
            >
              <QuestionCard
                :number="currentQuestion.number"
                :title="currentQuestion.title"
                :multiple="currentQuestion.multiple"
                :options="currentQuestion.options"
                :selected-value="selectedAnswers[currentQuestion.id]"
                @select="(code) => onSelectOption(currentQuestion.id, code)"
              />
            </QuizSection>
          </div>
        </Transition>

        <!-- Navigation -->
        <div class="flex items-center justify-between gap-4">
          <button
            type="button"
            class="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm font-bold hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 transition-transform"
            @click="goBack"
          >
            {{ currentIndex === 0 ? 'Back to start' : 'Back' }}
          </button>
          <div class="text-[11px] md:text-xs font-semibold text-gray-600 max-w-xs text-center hidden sm:block">
            You can go back or forward anytime.
          </div>
          <button
            v-if="!isLastQuestion"
            type="button"
            class="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-xl border-2 border-black bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm font-bold hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 transition-transform"
            @click="goNext"
          >
            Next Question
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center justify-center px-6 py-3 bg-[#FFD550] text-black rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-sm md:text-base font-bold hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform"
            @click="finishQuiz"
          >
            See my result
          </button>
        </div>

      </div>
    </section>

    <!-- Result modal -->
    <Modal v-model="showResultModal">
      <div class="text-center">
        <h2 class="font-display text-2xl md:text-3xl font-black text-gray-900 mb-4">
          You did it!
        </h2>
        <p class="text-base text-gray-700 mb-6">
          Here's your result. We'll use your choice to show the right image here.
        </p>
        <!-- Gender-based image placeholder (replace with real image src later) -->
        <div
          class="w-full aspect-[4/3] max-w-md mx-auto rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center text-gray-500 font-semibold mb-6"
        >
          Result image for {{ selectedGender === 'boy' ? 'boy' : 'girl' }}
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm font-bold hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 transition-transform"
          @click="backToBeginning"
        >
          Back to beginning
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'
import { getSEOConfig } from '@/lib/seo-config'
import { useConfetti } from '@/composables/useConfetti'
import Modal from '@/components/ui/Modal.vue'
import { computed, onMounted, ref } from 'vue'

useSEO(getSEOConfig('adventure'))
const { celebrateFromTop } = useConfetti()

type Option = {
  code: string
  label: string
  image?: string
}

type QuestionCardProps = {
  number: string
  title: string
  multiple?: boolean
  options: Option[]
}

type QuizSectionProps = {
  label: string
  title: string
  description?: string
}

type MatchingCardProps = {
  title: string
  bullets: string[]
}

type QuizQuestion = {
  id: string
  sectionLabel: string
  sectionTitle: string
  sectionDescription?: string
  number: string
  title: string
  multiple?: boolean
  options: Option[]
}

const emits = defineEmits<{
  navigate: [page: string]
}>()

const allQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    sectionLabel: 'Section 1',
    sectionTitle: "Let's Get Started!",
    sectionDescription: 'A quick warm-up to understand your child’s starting point with technology.',
    number: '1',
    title: 'Have you taken any tech or coding classes before?',

    options: [
      { code: 'A', label: 'No, this is my first time', image: '/quiz-images/quest1a.webp'},
      { code: 'B', label: 'Yes, a little', image: '/quiz-images/quest1b.webp' },
      { code: 'C', label: 'Yes, I already know some things', image: '/quiz-images/quest1c.webp' }
    ]
  },
  {
    id: 'q2',
    sectionLabel: 'Section 1',
    sectionTitle: "Let's Get Started!",
    sectionDescription: 'A quick warm-up to understand your child’s starting point with technology.',
    number: '2',
    title: 'How comfortable are you using a computer or tablet?',
    options: [
      { code: 'A', label: 'Beginner — just starting out', image: '/quiz-images/quest2a.webp' },
      { code: 'B', label: 'Average — I manage okay', image: '/quiz-images/quest2b.webp' },
      { code: 'C', label: 'Very comfortable — I use it all the time!', image: '/quiz-images/quest2c.webp' }
    ]
  },
  {
    id: 'q3',
    sectionLabel: 'Section 2',
    sectionTitle: 'Your Interests',
    sectionDescription: 'What makes you say “wow, that sounds fun!” when you hear about it?',
    number: '3',
    title: 'Which of these sounds the most fun to you? (Pick as many as you like!)',
    multiple: true,
    options: [
      { code: 'A', label: 'Creating games', image: '/quiz-images/quest3a.webp' },
      { code: 'B', label: 'Drawing or designing characters', image: '/quiz-images/quest3b.webp'  },
      { code: 'C', label: 'Doing science experiments', image: '/quiz-images/quest3c.webp'  },
      { code: 'D', label: 'Building apps', image: '/quiz-images/quest3d.webp'  },
      { code: 'E', label: 'Solving puzzles and logic problems' , image: '/quiz-images/quest3e.webp' },
      { code: 'F', label: 'Learning a new language', image: '/quiz-images/quest3f.webp'  },
      { code: 'G', label: 'Starting a small business', image: '/quiz-images/quest3g.webp'  }
    ]
  },
  {
    id: 'q4',
    sectionLabel: 'Section 2',
    sectionTitle: 'Your Interests',
    sectionDescription: 'What makes you say “wow, that sounds fun!” when you hear about it?',
    number: '4',
    title: 'If you had a computer right now, what would you like to create?',
    options: [
      { code: 'A', label: 'A video game', image: '/quiz-images/quest4a.webp' },
      { code: 'B', label: 'A mobile app', image: '/quiz-images/quest4b.webp'},
      { code: 'C', label: 'An animation or cartoon', image: '/quiz-images/quest4c.webp' },
      { code: 'D', label: 'A cool digital drawing', image: '/quiz-images/quest4d.webp' },
      { code: 'E', label: 'A science project', image: '/quiz-images/quest4e.webp' }
    ]
  },
  {
    id: 'q5',
    sectionLabel: 'Section 2',
    sectionTitle: 'Your Interests',
    sectionDescription: 'What makes you say “wow, that sounds fun!” when you hear about it?',
    number: '5',
    title: 'Which activity do you enjoy most?',
    options: [
      { code: 'A', label: 'Playing video games', image: '/quiz-images/quest5a.webp' },
      { code: 'B', label: 'Drawing or designing things', image: '/quiz-images/quest5b.webp' },
      { code: 'C', label: 'Figuring out how things work', image: '/quiz-images/quest5c.webp' },
      { code: 'D', label: 'Building things step by step', image: '/quiz-images/quest5d.webp' },
      { code: 'E', label: 'Learning new words or languages', image: '/quiz-images/quest5e.webp' }
    ]
  },
  {
    id: 'q6',
    sectionLabel: 'Section 3',
    sectionTitle: 'How You Think',
    sectionDescription: 'Every child thinks differently. These questions help us understand your unique style.',
    number: '6',
    title: 'When solving a problem, what do you usually do?',
    options: [
      { code: 'A', label: 'Try different things until it works', image: '/quiz-images/quest6a.webp'  },
      { code: 'B', label: 'Think carefully before trying', image: '/quiz-images/quest6b.webp'},
      { code: 'C', label: 'Ask questions and do research', image: '/quiz-images/quest6c.webp'},
      { code: 'D', label: 'Work with friends together', image: '/quiz-images/quest6d.webp' }
    ]
  },
  {
    id: 'q7',
    sectionLabel: 'Section 3',
    sectionTitle: 'How You Think',
    sectionDescription: 'Every child thinks differently. These questions help us understand your unique style.',
    number: '7',
    title: 'Do you enjoy puzzles, riddles, or logic games?',
    options: [
      { code: 'A', label: 'Yes, a lot! I love them!', image: '/quiz-images/quest7a.webp' },
      { code: 'B', label: 'Sometimes — depends on my mood', image: '/quiz-images/quest7b.webp' },
      { code: 'C', label: 'Not really my thing',  image: '/quiz-images/quest7c.webp' }
    ]
  },
  {
    id: 'q8',
    sectionLabel: 'Section 3',
    sectionTitle: 'How You Think',
    sectionDescription: 'Every child thinks differently. These questions help us understand your unique style.',
    number: '8',
    title: 'Do you like telling stories, creating characters, or making designs?',
    options: [
      { code: 'A', label: 'Yes! I love it!', image: '/quiz-images/quest8a.webp' },
      { code: 'B', label: 'Sometimes', image: '/quiz-images/quest8b.webp' },
      { code: 'C', label: 'No, not really', image: '/quiz-images/quest8c.webp' }
    ]
  },
  {
    id: 'q9',
    sectionLabel: 'Section 4',
    sectionTitle: 'Creative vs. Builder',
    sectionDescription: 'Some kids love making things look amazing, others love making things work – many enjoy both.',
    number: '9',
    title: 'Which sounds more exciting to you?',
    options: [
      { code: 'A', label: 'Designing things — making them look amazing',  image: '/quiz-images/quest9a.webp' },
      { code: 'B', label: 'Building things — making them actually work', image: '/quiz-images/quest9b.webp' },
      { code: 'C', label: 'Discovering how things work — understanding the “why”', image: '/quiz-images/quest9c.webp' }
    ]
  },
  {
    id: 'q10',
    sectionLabel: 'Section 4',
    sectionTitle: 'Creative vs. Builder',
    sectionDescription: 'Some kids love making things look amazing, others love making things work – many enjoy both.',
    number: '10',
    title: 'When you see a cool app, game, or cartoon — what makes you most curious?',
    options: [
      { code: 'A', label: 'How it was designed and how it looks',  image: '/quiz-images/quest10a.webp' },
      { code: 'B', label: 'How it was built and programmed', image: '/quiz-images/quest10b.webp' },
      { code: 'C', label: 'How the idea came about and how it works', image: '/quiz-images/quest10c.webp' }
    ]
  },
  {
    id: 'q11',
    sectionLabel: 'Section 4',
    sectionTitle: 'Creative vs. Builder',
    sectionDescription: 'Some kids love making things look amazing, others love making things work – many enjoy both.',
    number: '11',
    title: 'If you were given a new project to work on, which role would you enjoy most?',
    options: [
      { code: 'A', label: 'Designing how everything should look and feel',  image: '/quiz-images/quest11a.webp' },
      { code: 'B', label: 'Building the system that makes everything work',  image: '/quiz-images/quest11b.webp' },
      { code: 'C', label: 'Planning the idea and figuring out the best solution',  image: '/quiz-images/quest11c.webp' }
    ]
  },
  {
    id: 'q12',
    sectionLabel: 'Section 5',
    sectionTitle: 'How You Learn',
    sectionDescription: 'There’s no one right way to learn. We adapt our teaching style to match your child.',
    number: '12',
    title: 'How do you like to learn best?',
    options: [
      { code: 'A', label: 'Watching and trying it myself', image: '/quiz-images/quest12a.webp' },
      { code: 'B', label: 'Listening to explanations',  image: '/quiz-images/quest12b.webp' },
      { code: 'C', label: 'Doing hands-on activities',  image: '/quiz-images/quest12c.webp' },
      { code: 'D', label: 'Playing games while learning',  image: '/quiz-images/quest12d.webp' }
    ]
  },
  {
    id: 'q13',
    sectionLabel: 'Section 5',
    sectionTitle: 'How You Learn',
    sectionDescription: 'There’s no one right way to learn. We adapt our teaching style to match your child.',
    number: '13',
    title: 'When learning something difficult, what helps you the most?',
    options: [
      { code: 'A', label: 'Watching someone demonstrate it step by step', image: '/quiz-images/quest13a.webp'},
      { code: 'B', label: 'Trying it myself even if I make mistakes', image: '/quiz-images/quest13b.webp' },
      { code: 'C', label: 'Reading instructions and thinking it through', image: '/quiz-images/quest13c.webp' },
      { code: 'D', label: 'Working with others and discussing ideas', image: '/quiz-images/quest13d.webp' }
    ]
  },
  {
    id: 'q14',
    sectionLabel: 'Section 5',
    sectionTitle: 'How You Learn',
    sectionDescription: 'There’s no one right way to learn. We adapt our teaching style to match your child.',
    number: '14',
    title: "Imagine you're learning to build a simple game or project. What would excite you most?",
    options: [
      { code: 'A', label: 'Seeing the project come to life as I follow steps', image: '/quiz-images/quest14a.webp' },
      { code: 'B', label: 'Experimenting and changing things to see what happens', image: '/quiz-images/quest14b.webp'},
      { code: 'C', label: 'Understanding why each step works the way it does', image: '/quiz-images/quest14c.webp' },
      { code: 'D', label: 'Showing the final result to others', image: '/quiz-images/quest14d.webp' }
    ]
  },
  {
    id: 'q15',
    sectionLabel: 'Section 6',
    sectionTitle: 'Your Big Dreams',
    sectionDescription: 'Big dreams today become big projects tomorrow. Let’s peek into the future.',
    number: '15',
    title: 'What would you like to be able to do someday? (Pick as many as you like!)',
    multiple: true,
    options: [
      { code: 'A', label: 'Create my own video game' ,image: '/quiz-images/quest15a.webp'  },
      { code: 'B', label: 'Build my own mobile app', image: '/quiz-images/quest15b.webp'  },
      { code: 'C', label: 'Make animations or cartoons',image: '/quiz-images/quest15c.webp'  },
      { code: 'D', label: 'Become really good at science', image: '/quiz-images/quest15d.webp'  },
      { code: 'E', label: 'Speak another language' , image: '/quiz-images/quest15e.webp' },
      { code: 'F', label: 'Become a computer programmer', image: '/quiz-images/quest15f.webp'  }
    ]
  },
  {
    id: 'q16',
    sectionLabel: 'Section 6',
    sectionTitle: 'Your Big Dreams',
    sectionDescription: 'Big dreams today become big projects tomorrow. Let’s peek into the future.',
    number: '16',
    title: 'If you could solve one problem in the world using technology or creativity, what would you choose?',
    options: [
      { code: 'A', label: 'Creating fun games that make people happy', image: '/quiz-images/quest16a.webp' },
      { code: 'B', label: 'Building useful apps that help people in daily life', image: '/quiz-images/quest16b.webp'  },
      { code: 'C', label: 'Discovering new ideas in science or technology', image: '/quiz-images/quest16c.webp'  },
      { code: 'D', label: 'Creating art, animations, or stories that inspire others', image: '/quiz-images/quest16d.webp'  }
    ]
  },
  {
    id: 'q17',
    sectionLabel: 'Section 6',
    sectionTitle: 'Your Big Dreams',
    sectionDescription: 'Big dreams today become big projects tomorrow. Let’s peek into the future.',
    number: '17',
    title: 'Ten years from now, which of these would make you most proud?',
    options: [
      { code: 'A', label: 'Creating a game or app that many people use', image: '/quiz-images/quest17a.webp'  },
      { code: 'B', label: 'Inventing something that solves a real problem', image: '/quiz-images/quest17b.webp'  },
      { code: 'C', label: 'Designing something beautiful that people admire', image: '/quiz-images/quest17c.webp'  },
      { code: 'D', label: 'Teaching others what I have learned', image: '/quiz-images/quest17d.webp'  }
    ]
  },
  {
    id: 'q18',
    sectionLabel: 'Section 7',
    sectionTitle: 'Leadership & People Skills',
    sectionDescription: 'Some kids are quiet builders, some are bold leaders – we value every style.',
    number: '18',
    title: 'When working in a group at school, which role do you usually take?',
    options: [
      { code: 'A', label: 'I like to lead and organize the group',  image: '/quiz-images/quest18a.webp' },
      { code: 'B', label: 'I like sharing ideas and helping others',  image: '/quiz-images/quest18b.webp'},
      { code: 'C', label: 'I like doing my part quietly',  image: '/quiz-images/quest18c.webp' },
      { code: 'D', label: 'I prefer working alone',  image: '/quiz-images/quest18d.webp'}
    ]
  },
  {
    id: 'q19',
    sectionLabel: 'Section 7',
    sectionTitle: 'Leadership & People Skills',
    sectionDescription: 'Some kids are quiet builders, some are bold leaders – we value every style.',
    number: '19',
    title: 'Imagine you had ₦10,000. What would you most likely do with it?',
    options: [
      { code: 'A', label: 'Save it for something important later', image: '/quiz-images/quest19a.webp' },
      { code: 'B', label: 'Start a small idea or project with it', image: '/quiz-images/quest19b.webp' },
      { code: 'C', label: 'Buy something I really want', image: '/quiz-images/quest19c.webp' },
      { code: 'D', label: 'Share it or use it to help others', image: '/quiz-images/quest19d.webp' }
    ]
  },
  {
    id: 'q20',
    sectionLabel: 'Section 7',
    sectionTitle: 'Leadership & People Skills',
    sectionDescription: 'Some kids are quiet builders, some are bold leaders – we value every style.',
    number: '20',
    title: 'If you had to start a small project or business with friends, what would excite you most?',
    options: [
      { code: 'A', label: 'Thinking of the idea', image: '/quiz-images/quest20a.webp' },
      { code: 'B', label: 'Convincing people to join', image: '/quiz-images/quest20b.webp'},
      { code: 'C', label: 'Planning how to make it work', image: '/quiz-images/quest20c.webp' },
      { code: 'D', label: 'Managing the money', image: '/quiz-images/quest20d.webp' }
    ]
  },
  {
    id: 'q21',
    sectionLabel: 'Section 7',
    sectionTitle: 'Leadership & People Skills',
    sectionDescription: 'Some kids are quiet builders, some are bold leaders – we value every style.',
    number: '21',
    title: 'Which of these sounds most interesting to learn?',
    options: [
      { code: 'A', label: 'How to speak confidently in front of people', image: '/quiz-images/quest21a.webp' },
      { code: 'B', label: 'How to start a small business', image: '/quiz-images/quest21b.webp'},
      { code: 'C', label: 'How money works and how to grow it', image: '/quiz-images/quest21c.webp' },
      { code: 'D', label: 'How to become a great leader', image: '/quiz-images/quest21d.webp' }
    ]
  },
  {
    id: 'q22',
    sectionLabel: 'Section 7',
    sectionTitle: 'Leadership & People Skills',
    sectionDescription: 'Some kids are quiet builders, some are bold leaders – we value every style.',
    number: '22',
    title: 'When you see a problem around you (at school, home, or in your community), what do you usually think?',
    options: [
      { code: 'A', label: '“Someone should fix this.”', image: '/quiz-images/quest22a.webp' },
      { code: 'B', label: '“How could I solve this?”', image: '/quiz-images/quest22b.webp' },
      { code: 'C', label: '“Who can I gather to solve this together?”', image: '/quiz-images/quest22c.webp' },
      { code: 'D', label: '“Why does this problem happen?”', image: '/quiz-images/quest22d.webp' }
    ]
  },
  {
    id: 'q23',
    sectionLabel: 'Section 7',
    sectionTitle: 'Leadership & People Skills',
    sectionDescription: 'Some kids are quiet builders, some are bold leaders – we value every style.',
    number: '23',
    title: 'If people were describing you, what would they most likely say?',
    options: [
      { code: 'A', label: 'Creative',image: '/quiz-images/quest23a.webp' },
      { code: 'B', label: 'Smart problem solver', image: '/quiz-images/quest23b.webp' },
      { code: 'C', label: 'A good leader', image: '/quiz-images/quest23c.webp' },
      { code: 'D', label: 'Good with people', image: '/quiz-images/quest23d.webp' }
    ]
  }
]

const QUESTIONS_PER_RUN = 10

const questions = ref<QuizQuestion[]>([])
const currentIndex = ref(0)
const totalQuestions = computed(() => questions.value.length)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value === totalQuestions.value - 1)

const isSplashVisible = ref(true)
const selectedGender = ref<'boy' | 'girl' | null>(null)
const showResultModal = ref(false)
const selectedAnswers = ref<Record<string, string>>({})

function onSelectOption(questionId: string, code: string) {
  selectedAnswers.value = { ...selectedAnswers.value, [questionId]: code }
}

function pickRandomQuestions() {
  const pool = [...allQuestions]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  questions.value = pool.slice(0, QUESTIONS_PER_RUN)
  currentIndex.value = 0
  selectedAnswers.value = {}
}

function selectGender(gender: 'boy' | 'girl') {
  selectedGender.value = gender
  pickRandomQuestions()
}

const goNext = () => {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value += 1
  }
}

function goBack() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  } else {
    selectedGender.value = null
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function finishQuiz() {
  celebrateFromTop()
  showResultModal.value = true
}

function backToBeginning() {
  showResultModal.value = false
  selectedGender.value = null
  pickRandomQuestions()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const restart = () => {
  backToBeginning()
}

onMounted(() => {
  setTimeout(() => {
    isSplashVisible.value = false
  }, 2300)
})
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'

export const QuizSection = defineComponent({
  name: 'QuizSection',
  props: {
    label: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: false }
  },
  setup(props, { slots }) {
    return () =>
      h(
        'section',
        {
          class:
            'bg-white border-4 border-black rounded-[2rem] p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] min-h-[60vh] flex flex-col'
        },
        [
          // We keep the section wrapper styling but hide the label/title/description
          h('div', {}, slots.default?.())
        ]
      )
  }
})

export const QuestionCard = defineComponent({
  name: 'QuestionCard',
  props: {
    number: { type: String, required: true },
    title: { type: String, required: true },
    multiple: { type: Boolean, default: false },
    options: { type: Array, required: true },
    selectedValue: { type: String, default: undefined }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const options = (props.options as { code: string; label: string, image? : string }[]) || []
    return () =>
      h(
        'article',
        {
          class:
            'bg-[#FFFBF0] rounded-2xl p-5 md:p-6 '
        },
        [
          h('header', { class: 'flex items-start justify-between gap-4 mb-4' }, [
            h('div', { class: 'flex items-start gap-3' }, [
              h('div', {
                class:
                  'w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-sm font-black'
              }, props.number),
              h('div', {}, [
                h('h3', { class: 'text-base md:text-lg font-black text-gray-900' }, props.title),
                props.multiple
                  ? h('p', {
                      class:
                        'text-[11px] font-semibold text-gray-600 mt-1 uppercase tracking-wide'
                    }, 'You can choose more than one option')
                  : null
              ])
            ]),
            h('div', {
              class:
                'hidden md:flex items-center gap-2 text-[11px] font-semibold text-gray-600'
            }, [
              h('span', {
                class:
                  'inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border-2 border-dashed border-gray-300 text-[10px] text-gray-400'
              }, 'Icon')
            ])
          ]),
        h(
          'div',
          { class: 'grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4' },
          options.map((option) => {
            const isSelected = props.selectedValue === option.code
            return h(
              'label',
              {
                key: option.code,
                class: [
                  'group flex flex-col items-stretch rounded-2xl p-3 cursor-pointer transition-all border-2',
                  isSelected
                    ? 'bg-[#FFD550]/40 border-[#FF6B6B] shadow-[4px_4px_0px_0px_rgba(255,107,107,0.8)] ring-2 ring-[#FF6B6B] ring-offset-2'
                    : 'bg-white border-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                ].join(' '),
                onClick: (e: MouseEvent) => {
                  e.preventDefault()
                  emit('select', option.code)
                }
              },
              [
                option.image
                // Thumbnail block
                ? h('img', {
                     src: option.image,  // 👈 add image field to each option
                    class: 'w-full   md:h-28 rounded-xl object-cover  mb-2'
                  })

                : h('div', {
                  class:
                    'w-full h-24 md:h-28 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-[11px] font-semibold text-gray-400 mb-2'
                }, 'Thumbnail'),

                // Code + label row
                h('div', { class: 'flex items-start gap-2 mt-1' }, [
                  h('div', {
                    class: [
                      'mt-0.5 w-7 h-7 rounded-lg border-2 flex items-center justify-center text-[11px] font-bold',
                      isSelected ? 'border-[#FF6B6B] bg-[#FF6B6B] text-white' : 'border-dashed border-gray-300 bg-gray-50 text-gray-500'
                    ].join(' ')
                  }, option.code),
                  h('span', {
                    class:
                      'flex-1 text-xs md:text-sm font-semibold text-gray-800 leading-snug'
                  }, option.label)
                ]),
                // Selected indicator (checkmark when selected)
                h('div', { class: 'mt-2 flex justify-end' }, [
                  isSelected
                    ? h('span', {
                        class: 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-bold'
                      }, '✓')
                    : h('span', {
                        class:
                          'inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-400 bg-white text-[10px] text-gray-500'
                      }, props.multiple ? '+' : '')
                ])
              ]
            )
          })
        )
        ]
      )
  }
})

export const MatchingCard = defineComponent({
  name: 'MatchingCard',
  props: {
    title: { type: String, required: true },
    bullets: { type: Array, required: true }
  },
  setup(props) {
    const bullets = (props.bullets as string[]) || []
    return () =>
      h('div', {
        class: 'bg-[#FFFBF0] border-[3px] border-black rounded-2xl p-4 flex flex-col gap-2'
      }, [
        h('div', { class: 'flex items-center justify-between gap-3 mb-1' }, [
          h('h3', { class: 'text-sm md:text-base font-black text-gray-900' }, props.title),
          h('div', {
            class:
              'w-9 h-9 rounded-lg border-2 border-dashed border-gray-300 bg-white flex items-center justify-center text-[10px] font-semibold text-gray-400'
          }, 'Icon')
        ]),
        h(
          'ul',
          { class: 'space-y-1.5' },
          bullets.map((bullet) =>
            h('li', { key: bullet, class: 'flex items-start gap-2' }, [
              h('span', {
                class: 'mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#FF6B6B]'
              }),
              h('span', { class: 'text-xs md:text-sm font-medium text-gray-800' }, bullet)
            ])
          )
        )
      ])
  }
})

export default {
  name: 'AdventurePage',
  components: { QuizSection, QuestionCard, MatchingCard }
}
</script>

<style scoped>
.adventure-page {
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>


import { useState } from 'react';
import { Brain } from 'lucide-react';

const initialQuestions = [
  {
    question: "What is the most important rule of safe driving?",
    options: [
      "Always maintain speed",
      "Stay alert and focused",
      "Use horn frequently",
      "Race with others"
    ],
    correct: 1
  },
  {
    question: "What should you check before starting to drive?",
    options: [
      "Only fuel level",
      "Nothing, just start driving",
      "Mirrors, seatbelt, and surroundings",
      "Radio stations"
    ],
    correct: 2
  }
];

interface StartQuizProps {
  onComplete: (passed: boolean) => void;
}

export default function StartQuiz({ onComplete }: StartQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === initialQuestions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQuestion < initialQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      const passed = newScore === initialQuestions.length;
      onComplete(passed);
    }
  };

  const question = initialQuestions[currentQuestion];

  return (
    <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full">
      <div className="text-center mb-6">
        <Brain className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold text-white">Before You Start</h2>
        <p className="text-gray-400">Answer these safety questions to begin</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl text-white mb-6">{question.question}</h3>
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full p-4 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex gap-2">
          {initialQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestion ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}